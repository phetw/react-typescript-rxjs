import React, { Component } from 'react';
import { Observable, Subscription, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface IState {
  numbers: number;
  done: boolean;
}

export default class HelloWorld extends Component<any, IState> {
  numbers: Observable<number> = interval(1000);
  numbersSubscription$: Subscription = new Subscription();

  private onCounterDestroy$: Subject<any> = new Subject();

  constructor(props: any) {
    super(props);

    this.state = {
      numbers: 0,
      done: false,
    };
  }

  componentDidMount() {
    this.numbersSubscription$ = this.numbers
      .pipe(takeUntil(this.onCounterDestroy$))
      .subscribe((num: number) => {
        this.setState({
          numbers: num,
        });
      });
  }

  componentWillUnmount() {
    this.numbersSubscription$.unsubscribe();
  }

  destroyCounter = () => {
    this.setState(
      {
        done: true,
      },
      () => {
        this.onCounterDestroy$.next();
        this.onCounterDestroy$.complete();
      }
    );
  };

  render() {
    return (
      <section>
        <h1>Rxjs</h1>
        <h2>{this.state.numbers}</h2>
        <p>{this.state.done ? 'Done counting !' : ''}</p>
        <button onClick={this.destroyCounter}>Stop Counter</button>
      </section>
    );
  }
}
