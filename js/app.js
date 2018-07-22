var vm;
ymaps.ready(function () {
    vm = new Vue({
        el: '#app',
        data: function () {
            return {
                unbound_routs: [],
                districts: {},
                routs_map: null,
                bound_routs: [],
                colors: [
                    '#31bc9f', '#157abe'
                ]
            }
        },
        computed: {},
        mounted: function () {
            // получаем массив домов
            this.get_unbound_routs();
            // получаем список зон
            this.get_districts();
            // инит карты
            this.init_map();
            // расставляем маркеры
            this.set_markers();
        },
        methods: {
            get_unbound_routs: function () {
                // ajax to get routs
                this.unbound_routs = [
                    {
                        "address": "г. Москва, ул. Усачева, 33, строен. 1",
                        "position": [55.723188, 37.561111],
                        "zone": {
                            "name": "CЭ-1",
                            "chief": {
                                "name": "Крылоносов Семен Павлович",
                                "photo": "http://webapplayers.com/inspinia_admin-v2.7.1/img/a2.jpg"
                            }
                        }
                    },
                    {
                        "address": "г. Москва, ул. Усачева, 33/2, строен. 6",
                        "position": [55.722886, 37.561487],
                        "zone": {
                            "name": "CЭ-1",
                            "chief": {
                                "name": "Крылоносов Семен Павлович",
                                "photo": "http://webapplayers.com/inspinia_admin-v2.7.1/img/a2.jpg"
                            }
                        }
                    },
                    {
                        "address": "г. Москва, ул. Лужники, 1с2",
                        "position": [55.725193, 37.561013],
                        "zone": {
                            "name": "CЭ-95",
                            "chief": {
                                "name": "Акимова Ольга Владимировна",
                                "photo": "http://webapplayers.com/inspinia_admin-v2.7.1/img/a3.jpg"
                            }
                        }
                    },
                    {
                        "address": "г. Москва, Лужнецкий пр-д, 1",
                        "position": [55.725409, 37.560311],
                        "zone": {
                            "name": "CЭ-95",
                            "chief": {
                                "name": "Акимова Ольга Владимировна",
                                "photo": "http://webapplayers.com/inspinia_admin-v2.7.1/img/a3.jpg"
                            }
                        }
                    },
                    {
                        "address": "г. Москва, ул. 10-летия Октября, 2с4",
                        "position": [55.725817, 37.560676],
                        "zone": {
                            "name": "CЭ-95",
                            "chief": {
                                "name": "Акимова Ольга Владимировна",
                                "photo": "http://webapplayers.com/inspinia_admin-v2.7.1/img/a3.jpg"
                            }
                        }
                    }
                ];
            },
            get_districts: function () {
                var color = 0;
                var self = this;
                this.unbound_routs.forEach(function (i) {
                    var zone = i.zone.name;
                    if (!(zone in self.districts)) {
                        self.$set(self.districts, zone, self.colors[color]);
                        // начинаем с нуля если в массиве цветов меньше эл-тов
                        color = self.colors.length - 1 > color ? color + 1 : 0
                    }
                });

            },
            init_map: function () {
                var self = this;
                self.routs_map = new ymaps.Map("YMapsID", {
                    center: self.unbound_routs[0] ? self.unbound_routs[0].position : [55.76, 37.64], // Проверяем есть ли список центруем по первому
                    zoom: 15
                });
            },
            searchfields: function (searchParam, item) {
                // возвращает ложь если значение селекта не совпадает с нужным элтом
                var val = searchParam ? searchParam.target.value : 'all';
                return val == 'all' ? true : val == item.zone.name
            },
            set_markers: function (e) {
                var self = this;
                self.routs_map.geoObjects.removeAll();
                // наполняем пустые маршруты
                this.unbound_routs.forEach(function (item, i) {
                    if (!self.searchfields(e, item)) {
                        return
                    }
                    self.routs_map.geoObjects.add(new ymaps.Placemark(item.position, {
                        balloonContent: item.address + '<button class="add-btn" onclick="vm.add_rout(' + i + ')">Добавить</button>',
                        iconContent: '-'
                    }, {
                        preset: 'islands#circleIcon',
                        iconColor: '#cfd8df'
                    }));

                });
                var routs_list = [];
                // наполняем отмеченные маршруты
                this.bound_routs.forEach(function (item, i) {
                    if (!self.searchfields(e, item)) {
                        return
                    }
                    var color = self.districts[item.zone.name];
                    self.routs_map.geoObjects.add(new ymaps.Placemark(item.position, {
                        balloonContent: item.address + '<button class="add-btn" onclick="vm.remove_rout(' + i + ')">Удалить</button>',
                        iconContent: i + 1
                    }, {
                        preset: 'islands#circleIcon',
                        iconColor: color
                    }));
                    routs_list.push(item.position)
                });
                //строим пешеходный маршрут
                if(routs_list.length > 1){
                    ymaps.route(routs_list, {routingMode: 'pedestrian'}).then(function(r){
                        self.routs_map.geoObjects.add(r);
                        var points = r.getWayPoints();
                        points.options.set('visible', false);
                    });
                }
            },

            add_rout: function (i) {
                var el = this.unbound_routs[i];
                this.unbound_routs.splice(i, 1);
                this.bound_routs.push(el);
                var e = document.getElementById('filter');
                e.target = e;
                this.set_markers(e);
                this.send_routs();
            },

            remove_rout: function (i) {
                var el = this.bound_routs[i];
                this.bound_routs.splice(i, 1);
                this.unbound_routs.push(el);
                var e = document.getElementById('filter');
                e.target = e;
                this.set_markers(e);
                this.send_routs();
            },

            send_routs: function(){
                //Отправка в бек
            }
        }
    });
});
