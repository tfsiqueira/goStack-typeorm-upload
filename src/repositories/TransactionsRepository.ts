import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // const transactionsRepository = new Repository(Transaction);

    const allTransactions = await this.find();

    const { income, outcome } = allTransactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += parseFloat(`${transaction.value}`);
            break;
          case 'outcome':
            accumulator.outcome += parseFloat(`${transaction.value}`);
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
