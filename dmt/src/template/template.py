import json

class Template:
    def __init__(self, x, y):
        self.x = x
        self.y = y

def template_encoder(obj):
    if isinstance(obj, Template):
        return {"x": obj.x, "y": obj.y, "__MyClass__": True}
    return obj

def template_decoder(obj):
    if "__MyClass__" in obj:
        return Template(obj["x"], obj["y"])
    return obj