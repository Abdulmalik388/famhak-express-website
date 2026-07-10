from django.core.mail import send_mail
from django.conf import settings
from .models import Notification


def send_notification(user, title, message, notification_type='general'):
    """Create an in-app notification for a user"""
    Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type
    )


def send_email_notification(to_email, subject, message):
    """Send an email notification"""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email='famhaklawal2020@gmail.com',
            recipient_list=[to_email],
            fail_silently=False,
        )
    except Exception as e:
        print(f'Email error: {e}')

def notify_order_placed(order):
    """Notify customer that their order was placed and notify all available riders"""
    from django.contrib.auth import get_user_model
    User = get_user_model()

    # Notify customer
    title = 'Order Placed Successfully'
    message = f'''
Hi {order.customer.full_name},

Your delivery order has been placed successfully on Famhak Express!

Order Details:
- Pickup: {order.pickup_address}
- Dropoff: {order.dropoff_address}
- Package: {order.package_description}
- Price: ₦{order.price}

A rider will be assigned to your order shortly.
You will be notified once a rider accepts your order.

Thank you for choosing Famhak Express!
Team Famhak Express
    '''.strip()

    send_notification(order.customer, title, f'Your order has been placed. Price: ₦{order.price}', 'order_placed')
    send_email_notification(order.customer.email, f'Famhak Express — {title}', message)

    # Notify all available riders
    riders = User.objects.filter(role='rider', is_active=True)
    for rider in riders:
        rider_message = f'''
Hi {rider.full_name},

A new delivery order is available on Famhak Express!

Order Details:
- Pickup: {order.pickup_address}
- Dropoff: {order.dropoff_address}
- Package: {order.package_description}
- Earnings: ₦{float(order.price) * 0.8:.2f}

Login to the Famhak Express app to accept this order now!

Team Famhak Express
        '''.strip()

        send_notification(
            rider,
            'New Delivery Order Available!',
            f'New order from {order.pickup_address} to {order.dropoff_address}. Earn ₦{float(order.price) * 0.8:.2f}',
            'order_placed'
        )
        send_email_notification(
            rider.email,
            'Famhak Express — New Order Available',
            rider_message
        )


def notify_order_assigned(order):
    """Notify customer that a rider has accepted their order"""
    title = 'Rider Assigned to Your Order'
    customer_message = f'''
Hi {order.customer.full_name},

Great news! A rider has accepted your delivery order.

Rider Details:
- Name: {order.rider.full_name}
- Phone: {order.rider.phone}

Order Details:
- Pickup: {order.pickup_address}
- Dropoff: {order.dropoff_address}

Your rider is on their way to pick up your package.

Track your order live on the Famhak Express app.

Thank you for choosing Famhak Express!
Team Famhak Express
    '''.strip()

    rider_message = f'''
Hi {order.rider.full_name},

You have been assigned a new delivery order on Famhak Express!

Order Details:
- Pickup: {order.pickup_address}
- Dropoff: {order.dropoff_address}
- Package: {order.package_description}
- Receiver: {order.receiver_name} ({order.receiver_phone})
- Earnings: ₦{float(order.price) * 0.8:.2f}

Please pick up the package as soon as possible.

Team Famhak Express
    '''.strip()

    send_notification(order.customer, title, f'Rider {order.rider.full_name} has accepted your order', 'order_assigned')
    send_notification(order.rider, 'New Delivery Assigned', f'You have a new delivery from {order.pickup_address} to {order.dropoff_address}', 'order_assigned')
    send_email_notification(order.customer.email, f'Famhak Express — {title}', customer_message)
    send_email_notification(order.rider.email, 'Famhak Express — New Delivery Assigned', rider_message)
    send_email_notification('famhaklawal2020@gmail.com', f'Famhak Express — New Order Assigned #{str(order.id)[:8]}', f'Order {order.id} has been assigned to rider {order.rider.full_name}')


def notify_order_picked_up(order):
    """Notify customer that their package has been picked up"""
    title = 'Package Picked Up'
    message = f'''
Hi {order.customer.full_name},

Your package has been picked up by {order.rider.full_name} and is on its way!

Track your delivery live on the Famhak Express app.

Team Famhak Express
    '''.strip()

    send_notification(order.customer, title, f'Your package has been picked up by {order.rider.full_name}', 'order_picked_up')
    send_email_notification(order.customer.email, f'Famhak Express — {title}', message)


def notify_order_in_transit(order):
    """Notify customer that their order is in transit"""
    title = 'Your Package is On The Way'
    message = f'''
Hi {order.customer.full_name},

Your package is currently in transit and heading to its destination!

Delivery to: {order.dropoff_address}
Receiver: {order.receiver_name}

Track your delivery live on the Famhak Express app.

Team Famhak Express
    '''.strip()

    send_notification(order.customer, title, 'Your package is in transit and on the way!', 'order_in_transit')
    send_email_notification(order.customer.email, f'Famhak Express — {title}', message)


def notify_order_delivered(order):
    """Notify customer that their order has been delivered"""
    title = 'Package Delivered Successfully!'
    message = f'''
Hi {order.customer.full_name},

Your package has been delivered successfully!

Order Summary:
- Pickup: {order.pickup_address}
- Dropoff: {order.dropoff_address}
- Delivered by: {order.rider.full_name}
- Total paid: ₦{order.price}

We hope you had a great experience with Famhak Express.
Please rate your rider to help us improve our service.

Thank you for choosing Famhak Express!
Team Famhak Express
    '''.strip()

    send_notification(order.customer, title, 'Your package has been delivered successfully!', 'order_delivered')
    send_email_notification(order.customer.email, f'Famhak Express — {title}', message)
    send_email_notification('famhaklawal2020@gmail.com', f'Famhak Express — Order Delivered #{str(order.id)[:8]}', f'Order {order.id} has been delivered by {order.rider.full_name}')


def notify_order_cancelled(order):
    """Notify customer that their order has been cancelled"""
    title = 'Order Cancelled'
    message = f'''
Hi {order.customer.full_name},

Your delivery order has been cancelled.

Order Details:
- Pickup: {order.pickup_address}
- Dropoff: {order.dropoff_address}

If you did not cancel this order or have any concerns,
please contact us at famhaklawal2020@gmail.com

Thank you for choosing Famhak Express!
Team Famhak Express
    '''.strip()

    send_notification(order.customer, title, 'Your order has been cancelled', 'order_cancelled')
    send_email_notification(order.customer.email, f'Famhak Express — {title}', message)


def notify_payment_success(order):
    """Notify customer and rider that payment was successful"""
    title = 'Payment Successful'
    customer_message = f'''
Hi {order.customer.full_name},

Your payment of ₦{order.price} has been received successfully!

Order: {order.pickup_address} → {order.dropoff_address}
Reference: {order.payment.reference}

Thank you for choosing Famhak Express!
Team Famhak Express
    '''.strip()

    send_notification(order.customer, title, f'Payment of ₦{order.price} received successfully', 'payment_success')
    send_email_notification(order.customer.email, f'Famhak Express — {title}', customer_message)
    send_email_notification('famhaklawal2020@gmail.com', f'Famhak Express — Payment Received ₦{order.price}', f'Payment received for order {order.id}. Amount: ₦{order.price}')