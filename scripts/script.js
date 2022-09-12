

const app = Vue.createApp({
    el: '#demo',
    data() {
        return {
            searchQuery: '',
            search: '',
            newUser: [
                { name: 'Abc', data: '1', otzyv: 'blabla', },
                { name: 'Tom1', data: '2', otzyv: 'blabla1', },
                { name: 'Dom2', data: '3', otzyv: 'blabla2', }
            ],
            users: [],
            gridColumns: ['name', 'otzyv', 'data'],

            gridData: [
                { name: '', otzyv: 'user.otzyv', data: '' },
            ],
            info: null,
            orderType: 0,

        }
    },
    mounted() {


        axios
            .get('https://free-student.ru/process.php?action=read')
            .then(response => (this.info = response));
            // axios
            // .get('https://api.coindesk.com/v1/bpi/currentprice.json')
            // .then(response => (this.info = response));


        this.getAllUsers()
    },

    computed: {
        filteredList() {

            const { search, newUser, orderType } = this   //

            // Массив, который нужно отобразить в конечном итоге
            let fPersons;
            // Фильтруем людей
            fPersons = newUser.filter(p => p.name.toLowerCase().indexOf(search) !== -1)

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
                console.log("добавили");
                 this.gridData.push(this.users);
                 this.newUser.push(this.users);
                 this.users = {}
                

            },
            setOrderType(orderType) {
                this.orderType = orderType
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
