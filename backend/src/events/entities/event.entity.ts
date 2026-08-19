export class Event {
    titlu: string = "";
    id: number = 0;
    oras: string = "";
    address: string = "";
    data_si_ora_de_incepere: Date = new Date()
    data_si_ora_de_incheiere: Date = new Date()
    use_data_si_ora_de_incheiere: boolean = false;
    min_age: number = 0;
    use_min_age: boolean = false;
    artist: string = "";
}
