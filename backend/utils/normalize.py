def normalize_name(name: str) -> str:
    return name.strip().lower().replace(" ", "")

def normalize_vehicle_number(num: str) -> str:
    return num.strip().upper().replace(" ", "")

def normalize_text(text: str) -> str:
    return " ".join(text.lower().split())