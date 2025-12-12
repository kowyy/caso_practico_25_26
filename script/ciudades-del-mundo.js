const CIUDADES_DATA = {
    "continents": [
        {
            "name": "Europa",
            "countries": [
                {
                    "name": "Austria",
                    "cities": [
                        {
                            "name": "Viena",
                            "description": "Ciudad imperial con museos y música clásica a cada paso. El Palacio de Schönbrunn y la Ringstrasse condensan el barroco y el historicismo.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1731223832507-ebe5373129e6?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Viena"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1731223832507-ebe5373129e6?w=1600&q=90",
                                "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1600&q=90",
                                "https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Bélgica",
                    "cities": [
                        {
                            "name": "Brujas",
                            "description": "Centro medieval perfectamente conservado, canales bordeados de árboles y plazas adoquinadas como el Markt.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661963659103-9602b3811297?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
                                "alt": "Brujas"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661963659103-9602b3811297?w=1600&q=90",
                                "https://images.unsplash.com/photo-1589627277414-b534080350ff?w=1600&q=90",
                                "https://images.unsplash.com/photo-1710942512431-4231b48a657b?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Dinamarca",
                    "cities": [
                        {
                            "name": "Copenhague",
                            "description": "Equilibrio entre diseño contemporáneo y tradición nórdica. Nyhavn, Tívoli y barrios ciclistas muestran una ciudad humana.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1691414363231-836e2e1bf0ed?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Copenhague"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1691414363231-836e2e1bf0ed?w=1600&q=90",
                                "https://plus.unsplash.com/premium_photo-1697730017462-b99adb09466f?w=1600&q=90",
                                "https://images.unsplash.com/photo-1610357310685-105e8a575744?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Eslovenia",
                    "cities": [
                        {
                            "name": "Liubliana",
                            "description": "Capital pequeña y escénica, con casco peatonal, cafés junto al río y el castillo en lo alto.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1611576191056-3e6696029388?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Liubliana"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1611576191056-3e6696029388?w=1600&q=90",
                                "https://images.unsplash.com/photo-1716831313996-307f651b18c6?w=1600&q=90",
                                "https://images.unsplash.com/photo-1640024038740-45671e324c7e?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "España",
                    "cities": [
                        {
                            "name": "Barcelona",
                            "description": "Modernismo de Gaudí, mar y montaña en un mismo plano. La Sagrada Familia y el Park Güell son imprescindibles.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1630219694734-fe47ab76b15e?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Barcelona"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1630219694734-fe47ab76b15e?w=1600&q=90",
                                "https://images.unsplash.com/photo-1578912996078-305d92249aa6?w=1600&q=90",
                                "https://images.unsplash.com/photo-1610213989414-acc5773ba2c6?w=1600&q=90"
                            ]
                        },
                        {
                            "name": "Sevilla",
                            "description": "Casco histórico monumental, patios y azulejos. El Alcázar y la Catedral se suman al flamenco.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1559564477-6e8582270002?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Sevilla"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1559564477-6e8582270002?w=1600&q=90",
                                "https://images.unsplash.com/photo-1542115049-3af45a7e0ff4?w=1600&q=90",
                                "https://images.unsplash.com/photo-1634048703492-eeded62bb987?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Estonia",
                    "cities": [
                        {
                            "name": "Tallin",
                            "description": "Ciudad vieja medieval amurallada, torres y tejados de colores con vistas al Báltico.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1709862366377-54b16f3e51f9?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Tallin"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1709862366377-54b16f3e51f9?w=1600&q=90",
                                "https://images.unsplash.com/photo-1570302156974-8cca80c1f901?w=1600&q=90",
                                "https://plus.unsplash.com/premium_photo-1736177227990-6186fc0fe1b4?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Francia",
                    "cities": [
                        {
                            "name": "París",
                            "description": "Romance urbano: Sena, bulevares y museos icónicos. Notre Dame, Sacré-Coeur y la Torre Eiffel.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "París"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=1600&q=90",
                                "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=90",
                                "https://images.unsplash.com/photo-1551634979-2b11f8c946fe?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Hungría",
                    "cities": [
                        {
                            "name": "Budapest",
                            "description": "Arquitectura Art Nouveau, baños termales y paseos nocturnos sobre el Danubio.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Budapest"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?w=1600&q=90",
                                "https://images.unsplash.com/photo-1520986840182-5b15f734c85c?w=1600&q=90",
                                "https://images.unsplash.com/photo-1500078974918-738828bc0422?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Italia",
                    "cities": [
                        {
                            "name": "Florencia",
                            "description": "Cuna del Renacimiento: Duomo, Uffizi y artesanías en el Oltrarno.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1476362174823-3a23f4aa6d76?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Florencia"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1476362174823-3a23f4aa6d76?w=1600&q=90",
                                "https://images.unsplash.com/photo-1543429258-cc721a300e8a?w=1600&q=90",
                                "https://images.unsplash.com/photo-1526216538347-8a69e894ae24?w=1600&q=90"
                            ]
                        },
                        {
                            "name": "Roma",
                            "description": "La 'Ciudad Eterna' combina ruinas clásicas, plazas barrocas y vida de barrio.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1529154036614-a60975f5c760?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Roma"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1529154036614-a60975f5c760?w=1600&q=90",
                                "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&q=90",
                                "https://images.unsplash.com/photo-1626285220266-e35bd313d05b?w=1600&q=90"
                            ]
                        },
                        {
                            "name": "Venecia",
                            "description": "Sin coches y con un trazado acuático único. Canales, palacios y puentes conectan islas.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661963047742-dabc5a735357?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Venecia"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661963047742-dabc5a735357?w=1600&q=90",
                                "https://images.unsplash.com/photo-1627156863760-f49b81d8ab77?w=1600&q=90",
                                "https://images.unsplash.com/photo-1453747063559-36695c8771bd?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Malta",
                    "cities": [
                        {
                            "name": "La Valeta",
                            "description": "Fortificada y barroca, con miradores al Gran Puerto. Palacios e iglesias concentrados en un casco compacto.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1560365337-6f42f70dd874?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "La Valeta"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1560365337-6f42f70dd874?w=1600&q=90",
                                "https://plus.unsplash.com/premium_photo-1715293871539-fc52462c38dd?w=1600&q=90",
                                "https://images.unsplash.com/photo-1600498202878-79bdcbe69033?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Noruega",
                    "cities": [
                        {
                            "name": "Bergen",
                            "description": "Casas de madera en Bryggen, puerto vivo y montañas que caen a fiordos.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1643193388440-50fae300e1da?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Bergen"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1643193388440-50fae300e1da?w=1600&q=90",
                                "https://images.unsplash.com/photo-1548555851-4eff635e1107?w=1600&q=90",
                                "https://images.unsplash.com/photo-1521109762031-b71a005c25b7?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Países Bajos",
                    "cities": [
                        {
                            "name": "Ámsterdam",
                            "description": "Canales Patrimonio de la UNESCO, gables estrechos y cultura ciclista.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661878122586-2d75a86f3400?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Ámsterdam"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661878122586-2d75a86f3400?w=1600&q=90",
                                "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?w=1600&q=90",
                                "https://images.unsplash.com/photo-1605101100278-5d1deb2b6498?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Portugal",
                    "cities": [
                        {
                            "name": "Oporto",
                            "description": "Azulejos, puentes sobre el Duero y bodegas de vino de Oporto.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1677344087971-91eee10dfeb1?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Oporto"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1677344087971-91eee10dfeb1?w=1600&q=90",
                                "https://images.unsplash.com/photo-1591907303049-a5e5df26bcb9?w=1600&q=90",
                                "https://images.unsplash.com/photo-1527314392553-2c7bded21b23?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Reino Unido",
                    "cities": [
                        {
                            "name": "Londres",
                            "description": "Historia y vanguardia a orillas del Támesis. Museos gratuitos y parques inmensos.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Londres"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=90",
                                "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=1600&q=90",
                                "https://images.unsplash.com/photo-1506501139174-099022df5260?w=1600&q=90"
                            ]
                        },
                        {
                            "name": "Edimburgo",
                            "description": "Royal Mile, castillo y colinas verdes. La roca volcánica de Arthur’s Seat regala una panorámica excepcional.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1569668444050-b7bc2bfec0c7?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Edimburgo"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1569668444050-b7bc2bfec0c7?w=1600&q=90",
                                "https://images.unsplash.com/photo-1610991136128-838ca3c5497b?w=1600&q=90",
                                "https://images.unsplash.com/photo-1567802942109-0a5d92ed35b8?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "República Checa",
                    "cities": [
                        {
                            "name": "Praga",
                            "description": "Cúpulas y torres góticas sobre un casco antiguo fotogénico. Puente de Carlos al amanecer.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661963067279-2f7bf970c49c?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Praga"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661963067279-2f7bf970c49c?w=1600&q=90",
                                "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1600&q=90",
                                "https://images.unsplash.com/photo-1549041490-f64d74264d25?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Suiza",
                    "cities": [
                        {
                            "name": "Lucerna",
                            "description": "Lago, montes cercanos y el Kapellbrücke como postal.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1635855296516-837d8b00cae7?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Lucerna"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1635855296516-837d8b00cae7?w=1600&q=90",
                                "https://images.unsplash.com/photo-1518079521743-d5f88b127929?w=1600&q=90",
                                "https://images.unsplash.com/photo-1590217868274-5465bc689439?w=1600&q=90"
                            ]
                        },
                        {
                            "name": "Zúrich",
                            "description": "Casco antiguo elegante junto al lago, museos, galerías y vida junto al agua.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1620563092215-0fbc6b55cfc5?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1171",
                                "alt": "Zúrich"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1620563092215-0fbc6b55cfc5?w=1600&q=90",
                                "https://images.unsplash.com/photo-1544392827-1fc9d8111cb1?w=1600&q=90",
                                "https://images.unsplash.com/photo-1624900043694-4bd369e85a1f?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Islandia",
                    "cities": [
                        {
                            "name": "Reikiavik",
                            "description": "Arquitectura moderna como Harpa y Hallgrímskirkja entre paisajes volcánicos.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661962984700-16b03ecda58a?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Reikiavik"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661962984700-16b03ecda58a?w=1600&q=90",
                                "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=1600&q=90",
                                "https://images.unsplash.com/photo-1608468716860-5566b7671ea3?w=1600&q=90"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Asia",
            "countries": [
                {
                    "name": "China",
                    "cities": [
                        {
                            "name": "Beijing",
                            "description": "Capital imperial con la Ciudad Prohibida, hutongs y avenidas amplias.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1723433351351-0f6cd5d21537?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Beijing"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1723433351351-0f6cd5d21537?w=1600&q=90",
                                "https://images.unsplash.com/photo-1603120527222-33f28c2ce89e?w=1600&q=90",
                                "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1600&q=90"
                            ]
                        },
                        {
                            "name": "Hong Kong",
                            "description": "Horizonte denso en torno a un puerto lleno de ferris. Montañas, islas y reservas naturales.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Hong Kong"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1600&q=90",
                                "https://images.unsplash.com/photo-1577871598838-a543ee47cd79?w=1600&q=90",
                                "https://images.unsplash.com/photo-1542189412744-bfabf27522ee?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Corea del Sur",
                    "cities": [
                        {
                            "name": "Seúl",
                            "description": "Rascacielos y palacios, mercados nocturnos y una red de metro impecable.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661936414165-3039a8d906f9?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Seúl"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661936414165-3039a8d906f9?w=1600&q=90",
                                "https://images.unsplash.com/photo-1532649097480-b67d52743b69?w=1600&q=90",
                                "https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "India",
                    "cities": [
                        {
                            "name": "Jaipur",
                            "description": "La 'Ciudad Rosa': Hawa Mahal, fuertes y bazares color salmón.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Jaipur"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=90",
                                "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=1600&q=90",
                                "https://images.unsplash.com/photo-1557690756-62754e561982?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Japón",
                    "cities": [
                        {
                            "name": "Kioto",
                            "description": "Templos, santuarios y jardines clásicos. Hanami en primavera, rutas arboladas y geishas en Gion.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Kioto"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=90",
                                "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=1600&q=90",
                                "https://images.unsplash.com/photo-1581536763020-d2d7cfdd4df6?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Laos",
                    "cities": [
                        {
                            "name": "Luang Prabang",
                            "description": "Patrimonio UNESCO junto a la confluencia de ríos. Procesiones de monjes al amanecer.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661882477461-20d16af70819?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Luang Prabang"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661882477461-20d16af70819?w=1600&q=90",
                                "https://images.unsplash.com/photo-1606064195579-a48c728cec35?w=1600&q=90",
                                "https://images.unsplash.com/photo-1684918172034-399cc1ad6564?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Líbano",
                    "cities": [
                        {
                            "name": "Beirut",
                            "description": "Playas, clubes y azoteas frente a mezquitas y zocos históricos.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661963342411-11bc8489a1fe?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Beirut"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661963342411-11bc8489a1fe?w=1600&q=90",
                                "https://images.unsplash.com/photo-1640547594021-e73c87bb6484?w=1600&q=90",
                                "https://images.unsplash.com/photo-1596607808481-495f70aa5b26?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Omán",
                    "cities": [
                        {
                            "name": "Mascate",
                            "description": "Bahías y montañas enmarcando mezquitas, zocos y fuertes portugueses.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1725600462847-0317804cc466?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Mascate"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1725600462847-0317804cc466?w=1600&q=90",
                                "https://images.unsplash.com/photo-1621680696874-edd80ce57b72?w=1600&q=90",
                                "https://images.unsplash.com/photo-1599743777555-e362a2feab39?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Qatar",
                    "cities": [
                        {
                            "name": "Doha",
                            "description": "Corniche con skyline futurista, Souq Waqif y el Museo de Arte Islámico de I. M. Pei.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1539475314840-751cecc1dacd?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Doha"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1539475314840-751cecc1dacd?w=1600&q=90",
                                "https://images.unsplash.com/photo-1669815007479-494b3b51c2c3?w=1600&q=90",
                                "https://images.unsplash.com/photo-1537345532964-7c8f0749f8b8?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Tailandia",
                    "cities": [
                        {
                            "name": "Chiang Mai",
                            "description": "Templos en la ladera, cafés y mercados creativos.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1661929242720-140374d97c94?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Chiang Mai"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1661929242720-140374d97c94?w=1600&q=90",
                                "https://images.unsplash.com/photo-1544088739-00e1c238985e?w=1600&q=90",
                                "https://images.unsplash.com/photo-1682826556362-2c06b7ac75c5?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Vietnam",
                    "cities": [
                        {
                            "name": "Hanoi",
                            "description": "Lagos, templos y barrio francés con aire romántico. Calles angostas con cafés tradicionales.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1691960159290-6f4ace6e6c4c?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Hanoi"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1691960159290-6f4ace6e6c4c?w=1600&q=90",
                                "https://images.unsplash.com/photo-1599708153386-62bf3f035c78?w=1600&q=90",
                                "https://images.unsplash.com/photo-1576513500959-4f29b3fed28f?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Singapur",
                    "cities": [
                        {
                            "name": "Singapur",
                            "description": "Ciudad-jardín con selva urbana, Jardín Botánico y Gardens by the Bay.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Singapur"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1600&q=90",
                                "https://images.unsplash.com/photo-1496939376851-89342e90adcd?w=1600&q=90",
                                "https://images.unsplash.com/photo-1552415274-73ad7198cb93?w=1600&q=90"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "África",
            "countries": [
                {
                    "name": "Marruecos",
                    "cities": [
                        {
                            "name": "Chefchaouen",
                            "description": "Medina azul entre montañas del Rif. Callejuelas pintadas y puertas artesanales.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
                                "alt": "Chefchaouen"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=1600&q=90",
                                "https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=1600&q=90",
                                "https://images.unsplash.com/photo-1695601758107-cffeeceace44?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Sudáfrica",
                    "cities": [
                        {
                            "name": "Ciudad del Cabo",
                            "description": "Table Mountain, playas con pingüinos y barrios coloridos como Bo-Kaap.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1697730061063-ad499e343f26?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Ciudad del Cabo"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1697730061063-ad499e343f26?w=1600&q=90",
                                "https://images.unsplash.com/photo-1606799955515-85468ee78c26?w=1600&q=90",
                                "https://images.unsplash.com/photo-1545510120-66374ff70e4f?w=1600&q=90"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "Oceanía",
            "countries": [
                {
                    "name": "Australia",
                    "cities": [
                        {
                            "name": "Sídney",
                            "description": "Ópera icónica, bahía navegable y playas urbanas como Bondi.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Sídney"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600&q=90",
                                "https://images.unsplash.com/photo-1598948485421-33a1655d3c18?w=1600&q=90",
                                "https://images.unsplash.com/photo-1546268060-2592ff93ee24?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Nueva Zelanda",
                    "cities": [
                        {
                            "name": "Queenstown",
                            "description": "Capital de la adrenalina entre lago y montañas. Miradores naturales y aventuras.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1600466403153-50193d187dde?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Queenstown"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1600466403153-50193d187dde?w=1600&q=90",
                                "https://images.unsplash.com/photo-1565690482729-9290df702689?w=1600&q=90",
                                "https://images.unsplash.com/photo-1593755673003-8ca8dbf906c2?w=1600&q=90"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "América del Norte",
            "countries": [
                {
                    "name": "Canadá",
                    "cities": [
                        {
                            "name": "Ciudad de Quebec",
                            "description": "Casco amurallado en altura con vistas al San Lorenzo. Ambiente europeo.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1576771304215-6d4d30f7bb63?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Ciudad de Quebec"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1576771304215-6d4d30f7bb63?w=1600&q=90",
                                "https://images.unsplash.com/photo-1649466004673-2a8fd9f410e6?w=1600&q=90",
                                "https://images.unsplash.com/photo-1701205973276-b9b7b50a940e?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Cuba",
                    "cities": [
                        {
                            "name": "La Habana",
                            "description": "Arquitectura colonial de tonos pastel, música en cada esquina y paseos marítimos.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1570299437488-d430e1e677c7?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "La Habana"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1570299437488-d430e1e677c7?w=1600&q=90",
                                "https://images.unsplash.com/photo-1584098178554-62be72fa42c5?w=1600&q=90",
                                "https://plus.unsplash.com/premium_photo-1697730131336-01d0886e8865?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Estados Unidos",
                    "cities": [
                        {
                            "name": "Nueva York",
                            "description": "Arquitectura icónica, parques como Central Park y una escena artística incomparable.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Nueva York"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1600&q=90",
                                "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&q=90",
                                "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1600&q=90"
                            ]
                        },
                        {
                            "name": "San Francisco",
                            "description": "Puente Golden Gate, colinas y casas victorianas. Museos de talla mundial.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1719858403364-83f7442a197e?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "San Francisco"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1719858403364-83f7442a197e?w=1600&q=90",
                                "https://images.unsplash.com/photo-1554107136-57b138ea99df?w=1600&q=90",
                                "https://images.unsplash.com/photo-1547190994-0dfe4ab1bdae?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "México",
                    "cities": [
                        {
                            "name": "San Miguel de Allende",
                            "description": "Centro colonial con parroquia neogótica rosada. Calles adoquinadas, patios y arte.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1697729800872-866107ce82c4?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "San Miguel de Allende"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1697729800872-866107ce82c4?w=1600&q=90",
                                "https://images.unsplash.com/photo-1739582767008-faa274e18ac2?w=1600&q=90",
                                "https://images.unsplash.com/photo-1739582766847-a4051d6d5f04?w=1600&q=90"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": "América del Sur",
            "countries": [
                {
                    "name": "Argentina",
                    "cities": [
                        {
                            "name": "Buenos Aires",
                            "description": "Barrios con identidad, arquitectura variada y vida cultural intensa. Tango y parrillas.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1697729901052-fe8900e24993?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Buenos Aires"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1697729901052-fe8900e24993?w=1600&q=90",
                                "https://images.unsplash.com/photo-1610135206707-0f03e4800631?w=1600&q=90",
                                "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Brasil",
                    "cities": [
                        {
                            "name": "Río de Janeiro",
                            "description": "Playas míticas, selva urbana y el Cristo Redentor vigilando bahías y morros.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1671211307997-f4f552b0601c?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Río de Janeiro"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1671211307997-f4f552b0601c?w=1600&q=90",
                                "https://images.unsplash.com/photo-1551312183-66bca7944e4e?w=1600&q=90",
                                "https://images.unsplash.com/photo-1561577553-674ce32847a4?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Colombia",
                    "cities": [
                        {
                            "name": "Cartagena",
                            "description": "Murallas, plazas y casonas coloniales cubiertas de buganvillas.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1583531352515-8884af319dc1?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Cartagena"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=1600&q=90",
                                "https://images.unsplash.com/photo-1633627397446-04c7fca71c74?w=1600&q=90",
                                "https://images.unsplash.com/photo-1536308037887-165852797016?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Ecuador",
                    "cities": [
                        {
                            "name": "Quito",
                            "description": "Casco histórico dorado bajo volcanes andinos. Vistas desde la Basílica.",
                            "image": {
                                "url": "https://plus.unsplash.com/premium_photo-1697729921570-a7e324d7baac?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Quito"
                            },
                            "carousel_images": [
                                "https://plus.unsplash.com/premium_photo-1697729921570-a7e324d7baac?w=1600&q=90",
                                "https://images.unsplash.com/photo-1649960234214-38562054fdea?w=1600&q=90",
                                "https://images.unsplash.com/photo-1648742864594-0f28ca9996a2?w=1600&q=90"
                            ]
                        }
                    ]
                },
                {
                    "name": "Perú",
                    "cities": [
                        {
                            "name": "Cuzco",
                            "description": "Antigua capital inca con plazas, conventos y calles empedradas. Punto de partida a Machu Picchu.",
                            "image": {
                                "url": "https://images.unsplash.com/photo-1609944433409-81bda5323abc?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500",
                                "alt": "Cuzco"
                            },
                            "carousel_images": [
                                "https://images.unsplash.com/photo-1609944433409-81bda5323abc?w=1600&q=90",
                                "https://images.unsplash.com/photo-1559342825-3b44d9468086?w=1600&q=90",
                                "https://images.unsplash.com/photo-1533856797653-6f6dbf370efc?w=1600&q=90"
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
