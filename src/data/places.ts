import promenade from "@/assets/pondy-promenade.jpg";
import auroville from "@/assets/pondy-auroville.jpg";
import paradise from "@/assets/pondy-paradise.jpg";
import frenchQuarter from "@/assets/pondy-frenchquarter.jpg";

export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const places: Place[] = [
  { id: "white-town", name: "White Town & French Quarter", description: "Heritage streets and colonial facades — easiest to cover with a waiting cab.", image: frenchQuarter },
  { id: "promenade", name: "Promenade & Rock Beach", description: "Seafront drop-offs for sunrise walks along the Bay of Bengal.", image: promenade },
  { id: "auroville", name: "Auroville", description: "A comfortable 20 km ride from the city with parking and pickup handled.", image: auroville },
  { id: "paradise", name: "Paradise Beach & Chunnambar", description: "Boat house transfers with flexible waiting time for your group.", image: paradise },
];