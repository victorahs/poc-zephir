import {Component, Input, OnInit} from '@angular/core';
import {Tache} from '../../shared/domain/Tache';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {TacheService} from '../../shared/services/tache.service';
import {NgForm} from '@angular/forms';
import { ActionMetierService } from '../../shared/services/action-metier.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-traitement-tache',
  templateUrl: './traitement-tache.component.html',
  styleUrls: ['./traitement-tache.component.css']
})
export class TraitementTacheComponent implements OnInit {

  showDetail = true;
  idDossier: number
  listPieces = [];
  listActionsMetier= [];

  constructor(private tacheService: TacheService,
              private actionMetierService: ActionMetierService,
              private route: ActivatedRoute,
              private router: Router, 
              public toastr: ToastrService) { }

  ngOnInit() {

    this.route.params.subscribe((params: any) => {
      // liste des pieces :
      this.listPieces = this.tacheService.getPiecesByIdContext(+params.id);
      // list des actions métiers 
      this.actionMetierService.getAllByIdContext(+params.id).subscribe(data => this.listActionsMetier = data);
      // Status 
      let idLabelStatus = document.getElementById('idLabelStatus');
      idLabelStatus.innerHTML = '<span style="color: green">OK</span>'
      for (let p of this.listPieces) {
        if(p.status === 'À vérifier') {
          idLabelStatus.innerHTML = '<span style="color: #ffc520">Vérfication</span>';
          return;
        }
        if (p.status === 'À valider') {
          idLabelStatus.innerHTML = '<span style="color: #00b3ee" >Validation</span>';
        }
      }
    });
  }

  ngAfterViewInit() {
    this.route.params.subscribe((params: any) => {
      
      const element = document.getElementsByClassName('bg-row')[0];
      if(element != null) {
        element.classList.remove('bg-row')
      }
      document.getElementById('link'+ params.piece).classList.add('bg-row');
    });
  }

  detailPiece(piece: Tache,a) {
    this.router.navigate(['/TraitementTache', { id: piece.context.ident, piece: piece.ident }]);
    //this.router.navigate(['/TraitementTache/'+ident+';idPiece='+ident]);
    const element = document.getElementsByClassName('bg-row')[0];
    if(element != null) {
      element.classList.remove('bg-row')
    }
    a.classList.add('bg-row');   
  }    

  valider() {
    this.listPieces.forEach( lP => {
      this.idDossier = lP.idTacheMere
    })    
    this.tacheService.closeDossier(this.idDossier)
    this.toastr.success("Le dossier a été validé")
    this.router.navigate(['/gestionBO']);
  }

  validerModif() {

  }

  refuser() {
    this.listPieces.forEach( lP => {
      this.idDossier = lP.idTacheMere
    })
    this.tacheService.annulerDossier(this.idDossier)
    this.toastr.warning("Le dossier a été refusé")
    this.router.navigate(['/gestionBO']);
  }
}
