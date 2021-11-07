from genericpath import exists
import requests
import os.path
import json

events = "https://thingproxy.freeboard.io/fetch/https://events-api.revvracing.com/"
session = "https://thingproxy.freeboard.io/fetch/https://game-session-api.revvracing.com/v1.0/game/count/"

eventData = requests.get(events)
eventData = eventData.json()
with open(os.path.dirname(__file__)+'\\data\\events.json', 'w') as f:
    json.dump(eventData, f)

for event in eventData:
    eventID = event.get('id').upper()
    sessionDataPath = os.path.dirname(__file__)+'\\data\\sessionData\\'+eventID+'.json'
    if(not exists(sessionDataPath)):
        sessionData = requests.get(session+eventID)
        sessionData = sessionData.json()
        with open(sessionDataPath, 'w') as s:
            json.dump(sessionData,s)