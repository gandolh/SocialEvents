const jokes = [
    "De câți programatori este nevoie pentru a schimba un bec?\nDe niciunul, este o problemă de hardware.", 
    "-Dă-mi împrumut 500 de lei...\n-Poftim 512, să fie suma rotundă...",
    "Există 10 feluri de oameni. Cei care înțeleg sistemul binar și ceilalți.",
    "De ce confundă programatorii Halloween-ul cu Crăciunul?\nPentru că Oct 31 = Dec 25",
    "Am vrut sa-mi pun parola \"pen*s\" pe Social Planner, dar mi-a zis ca e prea scurta :(",
    "Mamaieeeee",
    "De ce nu se joacă programatorii \"ascunde-ascunde\"?\nPentru că nimeni nu-i caută.",
]
const getRandomJoke = () => {
    return jokes[Math.floor(Math.random() * jokes.length)];
}
export {getRandomJoke};