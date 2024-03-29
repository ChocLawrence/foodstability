import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-authors-guide',
  templateUrl: './authors-guide.component.html',
  styleUrls: ['./authors-guide.component.css']
})
export class AuthorsGuideComponent implements OnInit {
  public title = "Authors | Journal of Food Stability";

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private metaService: MetaService,
  ) { }

  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/authors-guide");
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'The Journal of Food Stability has as its guiding principle, an author\'s guide so as to guide authorswho would want to submit articles to the journal to be on the right path.' }
    );
  }

}
