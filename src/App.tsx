import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

interface PaymentInfo {
  transactionId: string;
  date: string;
  description: string;
  amount: number;
}

const FAIL_PERCENTAGE = 0.25;

const requestMockData = (): Promise<PaymentInfo[]> => {
  return new Promise((resolve, reject) => {
    const positive = Math.random() > FAIL_PERCENTAGE;
    if (positive)
      resolve([
        {
          transactionId: "1",
          date: "2024-02-20",
          description: "Payment 1",
          amount: 123.23,
        },

        {
          transactionId: "2",
          date: "2024-02-24",
          description: "Payment 2",
          amount: 223.23,
        },
        {
          transactionId: "3",
          date: "2024-02-20",
          description: "Payment 3",
          amount: 124.23,
        },
        {
          transactionId: "4",
          date: "2024-02-25",
          description: "Payment 4",
          amount: 123.25,
        },
        {
          transactionId: "5",
          date: "2024-02-30",
          description: "Payment 6",
          amount: 133.23,
        },
      ]);

    reject({ error: "something went wrong" });
  });
};

function App() {
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [data, setData] = useState<PaymentInfo[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    requestMockData()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.error);
      });
  }, []);

  const getFilteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((transaction) => {
      console.log(transaction, startDate, endDate);
      if (startDate && endDate) {
        return (
          moment(transaction.date).isSameOrAfter(startDate) &&
          moment(transaction.date).isSameOrBefore(endDate)
        );
      }
      if (startDate) return moment(transaction.date).isSameOrAfter(startDate);
      if (endDate) return moment(transaction.date).isSameOrBefore(endDate);

      return true;
    });
  }, [startDate, endDate, data]);

  if (error) {
    return (
      <div className="wrapper">
        <div className="body">{error}</div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="body">
        <div className="filter-tools">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.currentTarget.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.currentTarget.value)}
          />
          <button
            onClick={() => {
              setEndDate(undefined);
              setStartDate(undefined);
            }}
          >
            Reset
          </button>
        </div>
        <ul>
          {getFilteredData.map((transaction) => (
            <li key={transaction.transactionId}>
              <strong>{transaction.transactionId}</strong> - {transaction.date}{" "}
              - {transaction.description} - ${transaction.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
