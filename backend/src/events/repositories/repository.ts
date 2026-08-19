import { Event } from "../entities/event.entity";



export let event_list: Event[] = [];

var i:number = 5; 

for(i = 0;i < 10;i++) {
    let event_nou = new Event
    event_nou. id = i
    event_nou. titlu = "titlu" + i
    event_list.push(event_nou)
}
