import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-openaccess',
  templateUrl: './openaccess.component.html',
  styleUrls: ['./openaccess.component.css']
})
export class OpenaccessComponent implements OnInit {

  public title = "Open Access | Journal of Food Stability";

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private metaService: MetaService,
  ) { }


  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/openaccess");
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'The articles published on the Journal of Food Stability being original, pass through a thorough scrutiny of a renowned panel, are all under Open Access which means our articles are freely available, digital, online information. Open access scholarly literature is free of charge and often carries less restrictive copyright and licensing barriers than traditionally published works, for both the users and the authors.' }
    );
  }

}
