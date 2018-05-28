import {Component, Input, OnInit} from '@angular/core';
import {Tache} from '../../shared/domain/Tache';
import {ActivatedRoute, Router} from '@angular/router';
import {TacheService} from '../../shared/services/tache.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-traitement-tache',
  templateUrl: './traitement-tache.component.html',
  styleUrls: ['./traitement-tache.component.css']
})
export class TraitementTacheComponent implements OnInit {

  showDetail = true;
  listPieces = [];

  constructor(private tacheService: TacheService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      const tache = this.tacheService.getTacheById(+params.id);
      this.listPieces = this.tacheService.getPiecesByContext(tache.context)
    });

  }




}
