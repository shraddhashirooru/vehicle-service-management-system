# backend/utils/response.py

def success_response(data=None, message="Success"):
    return {
        "status": "success",
        "message": message,
        "data": data
    }


def error_response(message="Error"):
    return {
        "status": "error",
        "message": message
    }