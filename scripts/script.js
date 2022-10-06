
// Отправка данных на сервер

$('#form').submit(function () {
    $.post(
        'https://free-student.ru/process.php?action=update', // адрес обработчика
        $("#form").serialize(), // отправляемые данные  		

        function (msg) { // получен ответ сервера  
            $('#form').hide('slow');
            $('#form').html(msg);
        }
    );

    return false;
});
// var now = today.toLocaleString();

// $('#form').trigger('reset');
// $(function() {  
//   'use strict';
//   $('#form').on('submit', function(e) {
//       console.log('1'),

//     e.preventDefault();
//     $.ajax({

//       url: 'https://free-student.ru/process.php?action=update',
//       type: 'POST',
//       contentType: false,
//       processData: false,
//       data: new FormData(this),
//       success: function(msg) {
//         console.log(msg);
//         if (msg == 'ok') {
//         //alert('Ваше сообщение отправлено');
//           window.location.href = "spasibo.html";
//           $('#form').trigger('reset'); 
//          // очистка формы
//         } else {
//           alert('Ошибка');
//         }
//       }
//     });
//   });
// });


const emailCheckRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const app = Vue.createApp({
    el: '#demo',
    data() {
        return {
            searchQuery: '',
            search: '',
            users: [
                { name: 'Abc', data: '1', email: 'rumta@ya.ru', otzyv: 'blabla', },
                { name: 'Tom1', data: '2', email: 'rumta123@ya.ru', otzyv: 'blabla1', },
                { name: 'Dom2', data: '3', email: 'rumta22@ya.ru', otzyv: 'blabla2', }
            ],
            newUser: { name: '', otzyv: '', data: '', email: '' },
            gridColumns: ['name', 'otzyv', 'email', 'data'],

            gridData: [
                { name: '', otzyv: 'user.otzyv', data: '', email: 'email' },
            ],
            info: null,
            orderType: 0,
            email: null,
            name: '',
            isEmailTouched: false,
            valueData: 10


        }
    },
    mounted() {


        // axios
        //     .get('https://free-student.ru/process.php?action=read')
        //     .then(response => (this.info = response));

        if (localStorage.users) {
            this.users = JSON.parse(localStorage.users)
        }

        // axios
        // .get('https://api.coindesk.com/v1/bpi/currentprice.json')
        // .then(response => (this.info = response));
        // this.getAllUsers()
    },
    watch: {
        users: {
            handler(newUsers) {
                console.log('update')
                localStorage.users = JSON.stringify(newUsers)
            },
            deep: true
        }
    },
    computed: {
        filteredList() {

            const { search, users, orderType } = this

            // Массив, который нужно отобразить в конечном итоге
            let fPersons;
            // Фильтруем людей
            fPersons = users.filter(p => p.name.toLowerCase().indexOf(search) !== -1)

            //Сортировать
            if (orderType !== 0) {
                fPersons.sort(function (p1, p2) {  // Если возвращается отрицательное число p1, возвращается положительное число p2
                    // 1 означает порядок возрастания, 2 означает порядок убывания
                    if (orderType == 2) {
                        return p2.data - p1.data
                    }
                    else {
                        return p1.data - p2.data
                    }
                })
            }
            return fPersons;
            //  this.newUser

            //     .filter(
            //         (entry) => this.newUser.length
            //             ? Object.keys(this.newUser[0])
            //                 .some(key => ('' + entry[key]).toLowerCase().includes(this.search))
            //             : true
            //     );



        },

        isEmailValid() {
            return emailCheckRegex.test(this.newUser.email);
        },

        isEmailError() {
            return !this.isEmailValid && this.isEmailTouched;
        },
    },

    methods: {
        getAllUsers() {
            axios.get("https://free-student.ru/process.php?action=read").then(response => {
                console.log(response)
            })
                .catch(error => {
                    console.log('danger')
                    console.log(error.response)
                })

        },

        addUser: function () {
            console.log("добавили", this.newUser);
            this.gridData.push(this.newUser);
            this.users.push(this.newUser);
            this.$nextTick(function () {
                this.$refs.noteTitle.focus()
            })
            this.newUser = {}

        },
        remove(x) {
            console.log('удаление')
            this.users.splice(x, 1);
        },
        setOrderType(orderType) {
            this.orderType = orderType
        },
        someAction() {
            if (!this.isEmailValid) {
                return;
            }
            alert("Форма отправлена");
        },

    },



})

// register the grid component
app.component('demo-grid', {
    template: '#grid-template',
    props: {
        heroes: Array,
        columns: Array,
        filterKey: String
    },
    data() {
        const sortOrders = {};
        this.columns.forEach(function (key) {
            sortOrders[key] = 1;
        });
        return {
            sortKey: '',
            sortOrders
        }
    },
    computed: {
        filteredHeroes() {
            const sortKey = this.sortKey
            const filterKey = this.filterKey && this.filterKey.toLowerCase()
            const order = this.sortOrders[sortKey] || 1
            let heroes = this.heroes
            if (filterKey) {
                heroes = heroes.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return (
                            String(row[key])
                                .toLowerCase()
                                .indexOf(filterKey) > -1
                        )
                    })
                })
            }
            if (sortKey) {
                heroes = heroes.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return heroes
        },
        sortOrders() {
            const columnSortOrders = {}

            this.columns.forEach(function (key) {
                columnSortOrders[key] = 1
            })

            return columnSortOrders
        },


    },
    methods: {
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
        sortBy(key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        },

    }
})

app.mount('#demo')
