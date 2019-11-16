let isAdapt = false
function view() {
    if (document.documentElement.offsetWidth >= 768 && !isAdapt) {
        isAdapt = true
        this.mode = 'horizontal'
    } else if (document.documentElement.offsetWidth < 768 && isAdapt) {
        isAdapt = false
        this.mode = 'vertical'
    }
}

function adaptView () {
    view()
    window.addEventListener('resize', () => {
        view()
    })
}

module.exports = adaptView
