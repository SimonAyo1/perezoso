import React, { useState } from "react";
import { Address, useContractRead } from "wagmi";
import ABI from "../core/ABI.json";
import { CirclesWithBar } from "react-loader-spinner";

const LeaderboardPage: React.FC = () => {
  const giveawayAddress = "0x8505cdEBD67B82dc5434AFCc580465120E899CF3";
  const [dates, setDates] = useState<string[] | []>([]);
  const [leaderboard, setLeaderBoard] = useState<Address[]>([]);

  const { isLoading: gettingPlayerWinning, data: winners } = useContractRead({
    address: giveawayAddress,
    abi: ABI,
    functionName: "getAllWiners",
    onSuccess() {
      const allWinners = winners as Address[];
      setLeaderBoard((winners as Address[]) || []);
      getGiveawayDates(allWinners?.length);
    },
  });
  const getGiveawayDates = (giveaway_count: number) => {
    let giveawayDates: string[] = [];
    let currentDate = new Date();
    for (let i = 0; i < giveaway_count; i++) {
      giveawayDates.push(new Date(currentDate).toDateString());
      currentDate.setDate(currentDate.getDate());
    }

    setDates(giveawayDates);
  };

  return (
    <>
      <section className="hero-section">
        <div className="leaderboard-area">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table token-content table-borderless">
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }} scope="col">
                          #
                        </th>
                        <th style={{ width: "45%" }} scope="col">
                          Address
                        </th>
                        <th style={{ width: "25%" }} scope="col">
                          Winning
                        </th>
                        <th style={{ width: "25%" }} scope="col">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {" "}
                      {leaderboard.length == 0 && (
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: 20,
                            fontWeight: 500,
                            marginTop: 50,
                          }}
                        >
                          No Winner History At The Moment
                        </p>
                      )}
                      {leaderboard.length != 0 &&
                        leaderboard.map((addr, index) => (
                          <tr key={index}>
                            <td style={{ width: "5%" }}>{index + 1}</td>
                            <td style={{ width: "45%" }}>{addr}</td>
                            <td style={{ width: "25%" }}>1,000,000 PRZS</td>
                            <td style={{ width: "25%" }}>
                              {dates[index]}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {gettingPlayerWinning && (
        <div className="loader">
          <CirclesWithBar
            height="100"
            width="100"
            color="#fff"
            outerCircleColor="#fff"
            innerCircleColor="#fff"
            barColor="#fff"
            wrapperStyle={{}}
            wrapperClass=""
            visible={gettingPlayerWinning}
          />
        </div>
      )}
    </>
  );
};

export default LeaderboardPage;
