# Ngo_Koshan_Klassen_WS2223


## Ausführung:

1. Clonen Sie das Repository mithilfe von `git clone `.
2. Navigieren Sie in das Root-Verzeichnis.
3. Laden Sie alle dependencies mithilfe von `npm i` herunter.
4. Starten Sie den Server mithilfe von `npm run server`
5. Der Server ist nun auf Port 3000 verfügbar


## Benutzung:

GET <br>
`http://localhost:3000/car` <br>
`http://localhost:3000/driver`<br>
`http://localhost:3000/sight`<br>

GET - Bestimmtes Objekt erhalten

`http://localhost:3000/car/{id}` <br>
`http://localhost:3000/driver{id}`<br>

POST-Beispiel für einen Fahrer
`http://localhost:3000/driver`

```json  
{
    "driverId": 1,
    "name": "Fabian",
    "age": 24,
    "carId": 3,
    "budget": 20,
    "currentPos": {
      "lat": 51.02289632984686,
      "lng": 7.562342790969774
    }
  }
```

POST-Beispiel für ein Auto
`http://localhost:3000/car`

```json
 {
    "carId": 1,
    "name": "BMW",
    "fuelType": "Diesel",
    "minConsumPer100Kilometers": 8,
    "maxConsumPer100Kilometers": 24
  }
```

DELETE <br>
`http://localhost:3000/car` <br>
`http://localhost:3000/driver`

