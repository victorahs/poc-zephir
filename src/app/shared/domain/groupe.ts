export class Groupe {

  public libelle: string;

  constructor(public ident: number, public code: Code) {
    this.libelle = this.code.valueOf();
  }
}
export enum Code {
  VERIFICATION = 'Vérification des pièces justificatives',
  VALIDATION = 'Validation des pièces justificatives',
  AVENANT = 'Avenant / Résiliations',
  SOUSCRIPTION = 'Souscriptions'
}
