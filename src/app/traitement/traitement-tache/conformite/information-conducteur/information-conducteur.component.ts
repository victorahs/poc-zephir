import { Component, OnInit } from '@angular/core';
import { ActionMetierService } from '../../../../shared/services/action-metier.service';
import { Tache } from '../../../../shared/domain/Tache';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TacheService } from '../../../../shared/services/tache.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TraitementTacheComponent } from '../../traitement-tache.component';

@Component({
  selector: 'app-information-conducteur',
  templateUrl: './information-conducteur.component.html',
  styleUrls: ['./information-conducteur.component.css']
})
export class InformationConducteurComponent implements OnInit {

  public currentCRM = 0.68;
  public currentDate2delivrance = '2000-01-01';
  currentTache: Tache;
  private currentModal:NgbModalRef;
  constructor(private actionMetierService: ActionMetierService,
              private tacheService: TacheService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.currentCRM = 0.68;
    this.currentDate2delivrance = '2000-01-01';
    this.route.params.subscribe(data => {
      this.currentTache = this.tacheService.getTacheById(+data['id']);
     
    });

  }
  ngAfterViewInit() {
    this.currentCRM = 0.68;
    this.currentDate2delivrance = '2000-01-01';
  }

  ifChangement(crm, date2delivrance):boolean {
    if(crm.value != this.currentCRM || date2delivrance.value != this.currentDate2delivrance) {
      return true;
    }
    return false;
  }

  /**
   * Création automatique d'une action métier
   */
  demandeSansEffet(){

    this.actionMetierService.create(this.currentTache);
    this.toastr.success('Une demande "SANS-EFFET" a été creé');
  }
  refused(modal){
    this.currentModal = this.modalService.open(modal,  { size: 'lg', backdropClass: 'light-blue-backdrop', centered: true });
  }

  validate(crm, date2delivrance, modal) {
    if (this.ifChangement(crm, date2delivrance)) {
      this.currentModal = this.modalService.open(modal,  { size: 'lg', backdropClass: 'light-blue-backdrop', centered: true });
    } else {
      this.tacheService.closeTacheConforme(this.currentTache.ident);
      this.titleStatus();
    }
  }
  closeModal(){
    this.currentModal.close();
  }

  private titleStatus() {
    // Status 
    let idLabelStatus = document.getElementById('idLabelStatus');
    idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
    for (let p of this.tacheService.getPiecesByIdContext(this.currentTache.context.ident)) {
      if(p.status === 'À vérifier') {
        idLabelStatus.innerHTML = '<span style="color: #ffc520">Vérfication</span>';
        return;
      }
      if (p.status === 'À valider') {
        idLabelStatus.innerHTML = '<span style="color: #00b3ee" >Validation</span>';
      }
    }
  }

  DemandeAvt(crm, date2delivrance){
    this.currentTache.message = ' ';
    if(crm.value != this.currentCRM) {
      this.currentTache.message += crm.value + '. '; 
      this.currentCRM = crm.value;
    }
    if (date2delivrance.value != this.currentDate2delivrance) {
      this.currentTache.message += date2delivrance.value + '. ';
      this.currentDate2delivrance = date2delivrance.value;
    }
    this.actionMetierService.create(this.currentTache);
    this.toastr.success('Une demande d\'avenant a été creé');
  }
  /*private docSuivant() {

    const idNext = this.tacheService.nextId(this.currentTache.ident, parseInt(localStorage.getItem('USER'), 10));
    if (idNext == null || this.currentTache.ident === idNext ) {
      this.router.navigate(['/gestionBO']);
    } else {

      this.router.navigate(['/TraitementTache', idNext]);

    }
  }*/
}
