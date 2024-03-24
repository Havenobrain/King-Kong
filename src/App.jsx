import { useState } from "react";
import "./app.css";


function getWeather(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9131df60ce52f3e588002085beb6961b`).then(
        (response) => response.json()
    );
}

function getDateAfterToday(days) {
    return new Date(Date.now() + 60 * 60 * 24 * 1000 * (days + 1)).toLocaleDateString();
}

function getTimestampAfterToday(days) {
    return new Date(Date.now() + 60 * 60 * 24 * 1000 * (days + 1)).getTime();
}

function App() {
    const [newCity, setNewCity] = useState("");

    const [city, setCity] = useState("Moscow");
    const [cities, setCities] = useState(["Moscow", "London"]);

    const [temp, setTemp] = useState(undefined);
    const [forecast5Days, setForecast5Days] = useState([]);

    return (
        <>
            <div>city = {city}</div>
            <p>Текущая температура: {temp === undefined ? "Неизвестно" : temp.toFixed(1) + " C"} градусов</p>
            <button
                onClick={() => {
                    getWeather(city).then((data) => setTemp(data.main.temp - 273));
                }}
            >
                Получить прогноз на сейчас
            </button>
            {forecast5Days.length !== 0 && (
                <div>
                    {forecast5Days.map((temp, i) => (
                        <p key={i}>
                            {getDateAfterToday(i)} - {temp}
                        </p>
                    ))}
                </div>
            )}
            <button
                onClick={() => {
                    for (let i = 1; i <= 5; i++) {
                        setForecast5Days([]);
                        fetch(
                            `https://api.openweathermap.org/data/2.5/weather?q=${city}&dt=${getTimestampAfterToday(
                                i
                            )}&appid=9131df60ce52f3e588002085beb6961b`
                        )
                            .then((res) => res.json())
                            .then((d) => {
                                setForecast5Days((prev) => [...prev, (d.main.temp - 273).toFixed(1)]);
                            });
                    }
                }}
            >
                Получить прогноз на 5 дней
            </button>
            <div>
                <input type="text" onChange={(e) => setNewCity(e.target.value)} />
                <button
                    onClick={() => {
                        const copy = cities.map((x) => x);
                        copy.push(newCity);
                        setCities(copy);
                    }}
                >
                    Добавить город
                </button>
            </div>
            <select value={city} onChange={(event) => setCity(event.target.value)}>
                {cities.map((city, i) => (
                    <option value={city} key={i}>
                        {city}
                    </option>
                ))}
            </select>
        </>
    );
}

export default App;

