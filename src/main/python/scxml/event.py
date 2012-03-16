class Event():
    def __init__(self,name="",data=None):
        self.name = name
        self.data = data

    def __str__(self):  
        return self.name

    def __repr__(self): 
        return "<" + self.name + ">"
