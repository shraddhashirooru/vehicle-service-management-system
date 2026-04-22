# backend/utils/date_helper.py

from datetime import datetime

def format_date(date: datetime):
    return date.strftime("%Y-%m-%d")