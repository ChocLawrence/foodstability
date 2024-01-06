import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';


@Component({
  selector: 'app-ethics',
  templateUrl: './ethics.component.html',
  styleUrls: ['./ethics.component.css']
})
export class EthicsComponent implements OnInit {

  public title = "Ethics | Journal of Food Stability";

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private metaService: MetaService,
  ) { }


  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/ethics");
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'The Journal of Food Stability ensures that the ethics of the journal are followed so as to ensure that article writers are always on the right path whenever they intend to submit any research article to the journal' }
    );
  }

}
