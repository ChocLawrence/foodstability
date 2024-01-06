import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-apc',
  templateUrl: './apc.component.html',
  styleUrls: ['./apc.component.css']
})
export class ApcComponent implements OnInit {

  public title = "APC | Journal of Food Stability";

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private metaService: MetaService,
  ) { }


  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/apc");
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'The Journal of Food Stability accepts charges for Publication.These charges are to take care of the cost of reviewing these articles by renowned professionals in the field of Food Stability.' }
    );
  }

}
