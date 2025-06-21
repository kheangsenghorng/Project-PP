export default function Card({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto my-4">
      <div className="flex">
        <img
          src={data.image}
          alt={data.title}
          className="w-48 h-48 object-cover"
        />
        <div className="p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold">{data.title}</h2>
            <p className="text-gray-500">{data.description}</p>
            <div className="mt-2 text-yellow-500">
              {Array(Math.floor(data.rating)).fill("★").join("")}
              <span className="ml-2 text-gray-600">
                {data.rating} ({data.reviews} reviews)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">{data.duration}</p>
            <p
              className={`text-sm font-bold ${
                data.status === "Sold out" ? "text-red-500" : "text-green-500"
              }`}
            >
              {data.status}
            </p>
            <p className="text-lg font-bold">${data.price} / person</p>
          </div>
        </div>
      </div>
    </div>
  );
}
