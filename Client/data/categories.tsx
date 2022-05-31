import { UpCategoryNavType } from "../interfaces";

const _categories: UpCategoryNavType[] = [
    {
        id: "t2wfzfuq",
        name: "Помещения",
        path: "rooms",
        level: "Up",
        previewUrl:
            "https://img.freepik.com/free-photo/tv-cabinet-in-modern-living-room-with-armchair-and-plant-on-dark-marble-wall-3d-rendering_41470-3512.jpg?t=st=1648807211~exp=1648807811~hmac=bad5d7a2b0705d7acc53bab9d8a8cfc18df259e3920206f3e0b9cd4c78850cf4&w=1060",
        subcategories: [
            {
                id: "vtqzz5l5",
                name: "Деловые",
                path: "business",
                level: "Mid",
                subcategories: [
                    { id: "d1wlcu4z", name: "Тимбилдинг", path: "teambuilding", level: "Low" },
                    { id: "gvqq629g", name: "Курсы-уроки", path: "courses", level: "Low" },
                    { id: "5ijjzxlm", name: "Кулинарный мастер-класс", path: "culinary", level: "Low" },
                    { id: "vzt09p73", name: "Конференц залы", path: "conference", level: "Low" },
                    { id: "rykiw7ug", name: "Коворкинг-офис", path: "coworking", level: "Low" },
                    { id: "62zwjnym", name: "Запись интервью-подкаст", path: "interview", level: "Low" },
                    { id: "tmv6v85r", name: "Фотосъемка-видеосъемка", path: "media", level: "Low" },
                ],
            },
            {
                id: "aaxtmgh9",
                name: "Спортивные",
                path: "sport",
                level: "Mid",
                subcategories: [
                    {
                        id: "x2wc5p3b",
                        name: "Стадионы-залы-площадки",
                        path: "stadium",
                        level: "Low",
                    },
                    {
                        id: "jcksus9t",
                        name: "Стречинг-йога",
                        path: "yoga",
                        level: "Low",
                    },
                    {
                        id: "fyvs7sxi",
                        name: "Танцевальный класс",
                        path: "dance",
                        level: "Low",
                    },
                ],
            },
            {
                id: "wybppbov",
                name: "Кинопоказ",
                path: "movie",
                level: "Mid",
            },
            {
                id: "gu7ahppp",
                name: "Празднование",
                path: "celebration",
                level: "Mid",
            },
            {
                id: "ojwff9ue",
                name: "Выставка",
                path: "exhibition",
                level: "Mid",
            },
        ],
    },
    {
        id: "zw8ptqw8",
        name: "Одежда и аксессуары",
        path: "clothes",
        level: "Up",
        previewUrl:
            "https://img.freepik.com/free-photo/beautiful-masks-pieces-clothes_23-2147745290.jpg?t=st=1648807491~exp=1648808091~hmac=55a3595d83957fed7c6229934272ad4c02a6253ddeb0cc2b1ba2539414b084ca&w=996",
        subcategories: [
            {
                id: "x4vp72g6",
                name: "Сценическая одежда",
                path: "stage",
                level: "Mid",
            },
            {
                id: "61rglsd9",
                name: "Спортивная одежда",
                path: "sport",
                level: "Mid",
                subcategories: [
                    {
                        id: "tqd9iwwz",
                        name: "Летняя одежда",
                        path: "summer",
                        level: "Low",
                    },
                    {
                        id: "gm22p3bo",
                        name: "Зимняя одежда",
                        path: "winter",
                        level: "Low",
                    },
                ],
            },
        ],
    },
    {
        id: "vqzhwe7e",
        name: "Предметы и вещи",
        path: "objects",
        level: "Up",
        previewUrl: "https://images.pexels.com/photos/4246091/pexels-photo-4246091.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
        subcategories: [
            {
                id: "0epp4h8t",
                name: "Спортивные снаряжения",
                path: "sport",
                level: "Mid",
                subcategories: [
                    {
                        id: "rympks8v",
                        name: "Летнее снаряжение",
                        path: "summer",
                        level: "Low",
                    },
                    {
                        id: "omo6tpj6",
                        name: "Зимнее снаряжение",
                        path: "winter",
                        level: "Low",
                    },
                ],
            },
            {
                id: "9bmh3opd",
                name: "Техника",
                path: "technic",
                level: "Mid",
                subcategories: [
                    {
                        id: "oli3v7lg",
                        name: "Аудио-видео техника",
                        path: "audio-video",
                        level: "Low",
                    },
                    {
                        id: "zdnsb3x5",
                        name: "Игры-консоли",
                        path: "game",
                        level: "Low",
                    },
                    {
                        id: "xiyedna5",
                        name: "Техника для дома",
                        path: "home",
                        level: "Low",
                    },
                ],
            },
            {
                id: "we6e543s",
                name: "Транспорт",
                path: "transport",
                level: "Mid",
                subcategories: [
                    {
                        id: "c1xpigky",
                        name: "Авто-мото транспорт",
                        path: "car-moto",
                        level: "Low",
                    },
                    {
                        id: "s5ryw4bo",
                        name: "Велосипед",
                        path: "bike",
                        level: "Low",
                    },
                    {
                        id: "8ub1uyff",
                        name: "Самокат",
                        path: "scooter",
                        level: "Low",
                    },
                    {
                        id: "8ikxdtty",
                        name: "Детский транспорт",
                        path: "children",
                        level: "Low",
                    },
                ],
            },
            {
                id: "ximx4cm3",
                name: "Другие",
                path: "other",
                level: "Mid",
            },
        ],
    },
];

export default _categories;
