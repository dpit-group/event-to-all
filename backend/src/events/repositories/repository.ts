import { Event } from "../entities/event.entity";



export let event_list: Event[] = [];

var i:number = 5; 

for(i = 0;i < 10;i++) {
    let event_nou = new Event
    event_nou. id = i
    event_nou. titlu = "titlu" + i
    event_nou. oras = "oras " + i
    event_nou. address = "adresa" + i
    event_nou. data_si_ora_de_incepere = new Date()
    event_nou. data_si_ora_de_incheiere = new Date()
    event_nou. min_age = i
    event_nou. artist = "artist " + i
    event_list.push(event_nou)
}
