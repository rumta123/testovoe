const app = Vue.createApp({
    el: '#app',
    data() {
        return {
            notes: [],
            currentNote: null,
            date: new Date(),
        }

    },
    mounted() {
        if (localStorage.notes) {
            this.notes = JSON.parse(localStorage.notes)
        }
    },
    watch: {
        notes: {
            handler(newNotes) {
                console.log('update')
                localStorage.notes = JSON.stringify(newNotes)
            },
            deep: true
        }
    },

    methods: {
        createNote() {
            const newNote = { title: '', contents: '' }
            this.notes.push(newNote)
            this.currentNote = newNote
            this.$nextTick(function () {
                this.$refs.noteTitle.focus()
            })

        },
        remove(x) {
            this.notes.splice(x, 1);
        },

    },
    computed: {
        localeDate() {
            // Конвертируем число в строку. Для этого существуют специальные методы
            // toLocaleDateString() или toLocaleString() или toLocaleTimeString()
            // Итоговая строка будет зависеть от локализации системы пользователя. 
            // Для русской локали это будет "01.02.2020", 
            // для американской "2/1/2020", 
            // для немецкой — "1.2.2020"
            // Вы НЕ должны устанавливать формат даты самостоятельно
            return (new Date(this.date)).toLocaleDateString()
        },

    },

})
app.mount('#app')
