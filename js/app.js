var vm;
ymaps.ready(function () {
    vm = new Vue({
        el: '#app',
        data: function () {
            return {
                unbound_routs: [],
                districs: [],
                routs_map: null,
                bound_routs: []
            }
        },
        computed: {},
        mounted: function () {
            this.get_unbound_routs();
            this.init_map();
            this.set_markers();
        },
        methods: {
            init_map: function () {
                var self = this;
                self.routs_map = new ymaps.Map("YMapsID", {
                    center: self.unbound_routs[0].position,
                    zoom: 15
                });
            },
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

                var self = this;
                this.unbound_routs.forEach(function (i) {
                    i.unbound = true;
                    if (!self.districs.includes(i.zone.name)) {
                        self.districs.push(i.zone.name)
                    }
                });
            },

            set_markers: function (searchParam) {
                var self = this;
                self.routs_map.geoObjects.removeAll();
                this.unbound_routs.forEach(function (item, i) {
                    if (searchParam && searchParam != 'all'){
                            if (searchParam != item.zone.name){
                                return
                            }
                    }
                    self.routs_map.geoObjects.add(new ymaps.Placemark(item.position, {
                        balloonContent: item.address + '<button class="add-btn" onclick="vm.add_rout(' + i + ')">Добавить</button>',
                        iconContent: '-'
                    }, {
                        //preset: 'islands#yellowStretchyIcon',
                        iconColor: '#111'
                    }));

                });

                this.bound_routs.forEach(function (item, i) {
                    self.routs_map.geoObjects.add(new ymaps.Placemark(item.position, {
                        balloonContent: item.address + '<button class="add-btn" onclick="vm.remove_rout(' + i + ')">Удалить</button>',
                        iconContent: i + 1
                    }, {
                        preset: 'islands#yellowStretchyIcon',
                        iconColor: '#111'
                    }));

                });
            },

            add_rout: function (i) {
                var el = this.unbound_routs[i];
                this.unbound_routs.splice(i, 1);
                this.bound_routs.push(el);
                this.set_markers()
            },

            remove_rout: function (i) {
                var el = this.bound_routs[i];
                this.bound_routs.splice(i, 1);
                this.unbound_routs.push(el);
                this.set_markers()
            }
        }
    });
});
