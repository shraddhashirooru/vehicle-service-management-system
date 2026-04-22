# backend/utils/calculate_price.py

def calculate_total(components):
    """
    components = [
        {"price": 1000, "quantity": 2},
        {"price": 500, "quantity": 1}
    ]
    """

    total = 0

    for item in components:
        total += item["price"] * item["quantity"]

    return total