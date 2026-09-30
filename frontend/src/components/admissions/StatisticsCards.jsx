const StatisticsCards = ({ statistics }) => {
  const cards = [
    {
      title: "Applications",
      value: statistics.totalApplications,
    },
    {
      title: "Submitted",
      value: statistics.status.Submitted,
    },
    {
      title: "Under Review",
      value: statistics.status["Under Review"],
    },
    {
      title: "Accepted",
      value: statistics.status.Accepted,
    },
    {
      title: "Rejected",
      value: statistics.status.Rejected,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

      {cards.map((card) => (

        <div
          key={card.title}
          className="rounded-lg border p-5 shadow-sm bg-white"
        >

          <h3 className="text-gray-500 text-sm">
            {card.title}
          </h3>

          <p className="text-3xl font-bold mt-2">
            {card.value}
          </p>

        </div>

      ))}

    </div>
  );
};

export default StatisticsCards;