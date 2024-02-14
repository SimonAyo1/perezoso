import React, { useEffect, useState } from "react";
import { Address, useContractRead } from "wagmi";
import ABI from "../core/ABI.json";
import { CirclesWithBar } from "react-loader-spinner";

const LeaderboardPage: React.FC = () => {
  const giveawayAddress = "0xe96512431A6765680662A5a7DFFe6d24C0303204";
  const PRIZE = 0.001;
  // const INITIATED_DATE:
  const [leaderboard, setLeaderBoard] = useState<string[]>([]);

  const { isLoading: gettingCount, data: giveawayCount } = useContractRead({
    address: giveawayAddress,
    abi: ABI,
    functionName: "getCurrentGiveawayCount",
  });

  const {
    isLoading: gettingPlayerWinning,
    data: currentWinner,
    refetch: refetchPlayerWinning,
  } = useContractRead({
    address: giveawayAddress,
    abi: ABI,
    functionName: "getPlayerWinning",
    args: [Number(giveawayCount) == 0 ? 0 : Number(giveawayCount) - 1],
    onSuccess() {
      setLeaderBoard((prev) => [...prev, currentWinner as string]);
    },
  });

  useEffect(() => {
    for (let i = 0; i < Number(giveawayCount); i++) {
      refetchPlayerWinning();
    }
  }, [giveawayCount]);

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
                      {leaderboard[0] ==
                        "0x0000000000000000000000000000000000000000" && (
                        <p style={{ textAlign: "center", fontSize: 20, fontWeight: 500, marginTop: 50 }}>
                          No Winner History At The Moment
                        </p>
                      )}
                      {leaderboard[0] !=
                        "0x0000000000000000000000000000000000000000" &&
                        leaderboard.map((lb, index) => (
                          <tr>
                            <td style={{ width: "5%" }}>{index}</td>
                            <td style={{ width: "45%" }}>{lb}</td>
                            <td style={{ width: "25%" }}>{PRIZE} PRZS</td>
                            <td style={{ width: "25%" }}>
                              {(
                                new Date().getDate() - Number(giveawayCount)
                              ).toLocaleString()}
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

      {(gettingCount || gettingPlayerWinning) && (
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
            visible={gettingCount || gettingPlayerWinning}
          />
        </div>
      )}
    </>
  );
};

export default LeaderboardPage;
