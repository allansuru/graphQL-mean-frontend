import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

import { Apollo } from 'apollo-angular';
import gpl from 'graphql-tag';

const GET_QUOTES = gpl`
{
  quotes
  {
    quotes
    {
      _id
      quote
      author
    }
  }
}
`;

const CREATE_QUOTE = gpl`
mutation
	createQuote($quote: String!, $author: String!) {
	  createQuote(quoteInput: { quote: $quote, author: $author}) {
      _id,
      quote,
      author
    }
}
`;

const DELETE_QUOTE = gpl`
mutation
  deleteQuote($id: ID!) {
    deleteQuote(id: $id) {
      _id,
      quote,
      author
    }
  }
`;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  quotes$: Observable<any>;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.quotes$ = this.apollo.watchQuery({
      query: GET_QUOTES
    }).valueChanges.pipe(
      map((result: any) => {
        console.log(result)
        return result.data.quotes.quotes
      })
    )

  }


  public createHandler(quote: string, author: string): void {
    this.apollo.mutate({
      mutation: CREATE_QUOTE,
      refetchQueries: [{ query: GET_QUOTES }],
      variables: {
        quote,
        author
      }
    })
      .subscribe((result) => {
        console.log(result)
      })
  }

  public deleteHandler({ _id }): void {

    this.apollo.mutate({
      mutation: DELETE_QUOTE,
      refetchQueries: [{ query: GET_QUOTES }],
      variables: {
        id: _id
      }
    })
      .subscribe((result) => {
        console.log(result)
      })
  }
}
