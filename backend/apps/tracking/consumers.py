import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope['url_route']['kwargs']['order_id']
        self.group_name = f'tracking_{self.order_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get('type')

        if event_type == 'location_update':
            # Rider sending their location
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'location_update',
                    'lat': data.get('lat'),
                    'lng': data.get('lng'),
                    'rider_name': data.get('rider_name'),
                }
            )

        elif event_type == 'status_update':
            # Rider updating order status
            await self.update_order_status(
                self.order_id,
                data.get('status')
            )
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'status_update',
                    'status': data.get('status'),
                }
            )

    async def location_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'location_update',
            'lat': event['lat'],
            'lng': event['lng'],
            'rider_name': event['rider_name'],
        }))

    async def status_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'status': event['status'],
        }))

    @database_sync_to_async
    def update_order_status(self, order_id, new_status):
        from apps.orders.models import Order
        from django.utils import timezone
        try:
            order = Order.objects.get(id=order_id)
            order.status = new_status
            if new_status == 'delivered':
                order.delivered_at = timezone.now()
            order.save()
        except Order.DoesNotExist:
            pass