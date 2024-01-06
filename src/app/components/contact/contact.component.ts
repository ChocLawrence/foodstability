import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  public title = "Contact | Journal of Food Stability";

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private metaService: MetaService,
  ) { }


  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/contact");
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'The Journal of Food Stability is managed by the editor-in-chief Dr Tonfack Djikeng.It can be reached out by email through j.food.stability@gmail.com and +237 657 380 654.Follow us on Facebook, Google+ and Twitter ' }
    );
  }

}
