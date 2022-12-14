

const emailCheckRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const app = Vue.createApp({
    el: '#demo',
    data() {
        return {
            errorMsg: '',
            successMsg: '',
            searchQuery: '',
            search: '',
            users: [

            ],
            newUser: { id: '', name: '', otzyv: '', data: '', email: '' },
            currentUser: {},
            fethUser: 'https://free-student.ru/process.php?action=read',
            gridColumns: ['name', 'otzyv', 'email', 'data'],

            gridData: [
                { name: '', otzyv: '', data: '', email: '', edit: '' },
            ],
            info: [],
            orderType: 0,
            email: null,
            name: '',
            isEmailTouched: false,

            // valueData: 10


        }
    },
    async mounted() {

        const response = await fetch(this.fethUser)
        const result = await response.json()
        // response.users[0].name
        // this.users.push(result)
        console.log(result.users)

        axios
            .get('https://free-student.ru/process.php?action=read')
            .then(response => (this.users = response.data.users));
        // this.newUser();
        if (localStorage.users) {
            this.users = await JSON.parse(localStorage.users)

        }


    },
    watch: {
        users: {
            handler(newUsers) {
                console.log('update')
                localStorage.users = JSON.stringify(newUsers)
            },
            deep: true
        },

    },
    computed: {
        filteredList() {

            const { search, users, orderType } = this

            // Массив, который нужно отобразить в конечном итоге
            let fPersons
            // Фильтруем людей





            fPersons = users.filter(p => p.name.toUpperCase().indexOf(search.toUpperCase()) !== -1)


            // fPersons1 = users.filter(p => p.name.toLowerCase().indexOf(search)   !== -1)
            console.log(fPersons)
            // fPersons = users.filter(p => p.name.indexOf(search) !== -1)

            //Сортировать

            if (orderType !== 0) {

                fPersons.sort(function (p1, p2) {  // Если возвращается отрицательное число p1, возвращается положительное число p2
                    // 1 означает порядок возрастания, 2 означает порядок убывания
                    if (orderType == 2) {

                        return Date.parse(p2.data) - Date.parse(p1.data)
                    }
                    else {
                        return Date.parse(p1.data) - Date.parse(p2.data)
                    }
                })
            }

            return fPersons



        },

        isEmailValid() {
            return emailCheckRegex.test(this.newUser.email);
        },

        isEmailError() {
            return !this.isEmailValid && this.isEmailTouched;
        },
    },

    methods: {



        addUser: function () {
            console.log("добавили", this.newUser);
            this.newUser.data = new Date().toLocaleString()

            this.newUser.edit = 1
            this.gridData.push(this.newUser);

            this.users.push(this.newUser);




            axios.post('https://free-student.ru/process.php?action=create', this.newUser, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },

            }, console.log(this.newUser, 'ready'))

            this.$nextTick(function () {
                this.$refs.noteTitle.focus()
                this.newUser = {}
            })
            axios
                .get('https://free-student.ru/process.php?action=read')
                .then(response => (this.users = response.data.users));
            // this.newUser = {}

        },


        update() {

            axios.get('https://free-student.ru/process.php?action=update&id=' + this.newUser.id + '&otzyv=' + this.newUser.otzyv, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },

            })
            this.$nextTick(function () {
                this.$refs.noteTitle.focus()
                this.newUser = {}
            })


        },
        remove(id) {
            console.log('удаление')
            //  отфильтровать все пользователей, где пользователь id   не равен id
            this.users = this.users.filter(user => user.id !== id)
            axios.get('https://free-student.ru/process.php?action=delete&id=' + id, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },

            }, console.log(id, 'delete'))

            // this.users.splice(id, 1)
            // axios
            //     .get('https://free-student.ru/process.php?action=read')
            //     .then(response => (this.users = response.data.users));

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
        someAction1() {
            console.log('обновили')
        }

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