import React, { useState } from "react";
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import ABI from "../core/ABI.json";
import TOKENABI from "../core/TokenABI.json";
import { toast } from "react-toastify";
import { CirclesWithBar } from "react-loader-spinner";

const DashboardPage: React.FC = () => {
  let PRIZE = 5;
  const giveawayAddress = "0x8505cdEBD67B82dc5434AFCc580465120E899CF3";
  const tokenAddress = "0x53Ff62409B219CcAfF01042Bb2743211bB99882e";
  let TICKET_PRICE = 1000;
  const [ticket, setTicket] = useState<number>(0);
  const [priceToPay, setPriceToPay] = useState<number>(0);
  const [winning, setWinning] = useState<string>("");
  const { address, isConnected } = useAccount();
  const [ticketsBought, setTicketBought] = useState<number>(0);
  function countOccurrences(arr: any[], element: any) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === element) {
        count++;
      }
    }
    return count;
  }
  const { isLoading: gettingCount, data: giveawayCount } = useContractRead({
    address: giveawayAddress,
    abi: ABI,
    functionName: "getCurrentGiveawayCount",
    onSuccess() {
      refetchWinners();
    },
    watch: true,
  });

  const { isLoading: gettingNoOfPlayers, data: currentPlayers } =
    useContractRead({
      address: giveawayAddress,
      abi: ABI,
      functionName: "getCurrentPlayers",
      watch: true,
      onSuccess: (data: Address[]) => {
        let count = 0;
        data?.forEach((player) => {
          if (player == address) count++;
        });
        setTicketBought(count);
      },
    });

  const { data: maxTicket } = useContractRead({
    address: giveawayAddress,
    abi: ABI,
    functionName: "getMaxTicket",
  });

  const {
    isLoading: gettingPlayerWinning,
    data: winners,
    refetch: refetchWinners,
  } = useContractRead({
    address: giveawayAddress,
    abi: ABI,
    functionName: "getAllWiners",

    onSuccess() {
      const allWinners: Address[] = winners as Address[];
      const count = countOccurrences(allWinners, address);

      setWinning("$" + PRIZE * count + " PRZS Token");
    },
  });

  const {
    data: approval,
    isLoading: approving,
    write: approve,
  } = useContractWrite({
    address: tokenAddress,
    abi: TOKENABI,
    functionName: "approve",
    args: [giveawayAddress as Address, priceToPay * 10 ** 18],
    onSuccess: (data) => {
      console.log(data, "cc1cc");
      waitForApproval();
    },
    onError() {
      if (!isConnected) {
        toast("Please connect your wallet first");
        return;
      }
      toast("Error, Approval unsuccessful.");
    },
  });

  const { isLoading: isLoadingWaitForTx, refetch: waitForApproval } =
    useWaitForTransaction({
      hash: approval?.hash,
      onSuccess(data) {
        console.log(data, "cccc");

        enterDraw();

      },
      onError: (data) => {
       console.log(data, "wwwwww");
      },
      enabled: false,
    });

  const { isLoading, write: enterDraw } = useContractWrite({
    address: giveawayAddress,
    abi: ABI,
    functionName: "EnterGiveaway",
    args: [ticket],
    onSuccess() {
      toast("Successfully Entered Giveaway");
    },
    onError(data) {
      if (!isConnected) {
        toast("Please connect your wallet first");
        return;
      }
      if (data?.stack?.includes("Your balance is not enough!")) {
        toast("Your balance is not enough!");
        return;
      }
      if (data?.stack?.includes("Ticket entered is above maximum ticket")) {
        toast("Ticket entered is above maximum ticket" + " of " + maxTicket);
        return;
      }
      if (
        data?.stack?.includes(
          "Your existing tickets plus this ticket exceeds the maximum ticket limit"
        )
      ) {
        toast(
          "Your existing tickets plus this ticket exceeds the maximum ticket limit" +
            " of " +
            maxTicket
        );
        return;
      }
      if (data?.stack?.includes("insufficient allowance")) {
        toast("Insufficient Allowance");
        return;
      }
      toast("Error, Transaction unsuccessful.");
    },
  });

  return (
    <>
      <section className="hero-section">
        <div className="staking-area">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-7">
                <div className="card no-hover staking-card single-staking">
                  <h3 className="m-0">Perezoso Raffle Draw</h3>
                  <span className="balance">$5 PRZS Token Prize</span>

                  <div className="tab-content mt-md-3" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="tab-one"
                      role="tabpanel"
                      aria-labelledby="tab-one-tab"
                    >
                      <div className="input-box my-4 d-flex row">
                        <div className="input-area col-lg-6 col-12 mb-3">
                          <div className="input-text">
                            <label>Ticket Price</label>
                            <input
                              type="text"
                              value={TICKET_PRICE + " PRZS"}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="input-area col-lg-6 col-12 mb-3">
                          <div className="input-text">
                            <label>Ticket(s)</label>
                            <input
                              type="number"
                              placeholder="0.00"
                              onChange={(e) => {
                                setTicket(parseInt(e.target.value));
                                setPriceToPay(
                                  parseInt(e.target.value) * TICKET_PRICE
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div className="input-area col-lg-6 col-12 mb-3">
                          <div className="input-text">
                            <label>Total To Pay</label>
                            <input
                              type="number"
                              placeholder="0.00"
                              value={priceToPay}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-12">
                          <button
                            className="btn btn-secondary mt-4 w-100"
                            disabled={priceToPay == 0}
                            onClick={() => approve()}
                          >
                            Buy Ticket
                          </button>
                        </div>
                      </div>
                      <span>
                        Note: The giveaway would be done every day at 9:00 P.M
                      </span>
                      <div className="staking-tab-content mt-4">
                        <p>Tokenomics</p>
                        <div
                          className="info-box"
                          style={{ marginTop: "-20px" }}
                        >
                          <div>
                            <ul className="list-unstyled">
                              <li className="d-flex justify-content-between">
                                <strong>Contract Address:</strong>
                                <a href="https://bscscan.com/token/0x53Ff62409B219CcAfF01042Bb2743211bB99882e">
                                  0x53F...9882e
                                </a>
                              </li>
                              <li className="d-flex justify-content-between">
                                <strong>Token Name:</strong>{" "}
                                <span>Perezoso</span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <strong>Token Symbol:</strong>
                                <span>PRZS</span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <strong>Max Token Supply:</strong>
                                <span>420,000,000,000,000 PRZS</span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <strong>Token Price:</strong>
                                <span>$0.00</span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <strong>Circulation Supply:</strong>
                                <span>----</span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <strong>Holders:</strong>
                                <span>471+</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-5">
                <div className="staking-items mt-4 mt-md-0">
                  <div className="card no-hover staking-card">
                    <h3 className="m-0">{winning}</h3>
                    <p>Your Winnings</p>
                  </div>
                  <div className="card no-hover staking-card my-4">
                    <h3 className="m-0">{ticketsBought}</h3>
                    <p>Your Ticket(s)</p>
                  </div>
                  <div className="card no-hover staking-card my-4">
                    <h3 className="m-0">
                      {Number(giveawayCount) * TICKET_PRICE} PRZS
                    </h3>
                    <p>Total Rewards Distributed</p>
                  </div>
                  <div className="card no-hover staking-card">
                    <h3 className="m-0">
                      {(currentPlayers as string[])?.length}
                    </h3>
                    <p>Current Number of Players Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {(isLoading ||
        approving ||
        gettingCount ||
        gettingPlayerWinning ||
        gettingNoOfPlayers) && (
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
            visible={
              isLoading ||
              approving ||
              gettingCount ||
              gettingPlayerWinning ||
              gettingNoOfPlayers ||
              isLoadingWaitForTx
            }
          />
        </div>
      )}
    </>
  );
};

export default DashboardPage;
