

const CardHotel = () => {
  return (
    <section>
      <div
        className="max-w-[1250px] mx-auto my-5"
        data-bs-spy="scroll"
        data-bs-target="#list-example"
        data-bs-smooth-scroll="true"
        tabIndex="0"
      >
        {/* Heading */}
        <h4 className="mb-5 border rounded p-3 text-2xl" id="hotel-tab">
          Recommended stays for you want booking private hotel
        </h4>

        {/* Row for Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden h-[320px]">
              <a href="#">
                <img
                  src="./image/Hotel in kompot/10.jpg"
                  className="w-full h-[320px] object-cover rounded"
                  alt="Views"
                />
                <div className="absolute inset-0 flex hover:bg-black hover:bg-opacity-50  transition justify-center rounded-lg items-center">
                  <h5 className="text-white font-bold">Views</h5>
                </div>
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden h-[320px]">
              <a href="#">
                <img
                  src="./image/Hotel in seam rep/5.jpg"
                  className="w-full h-[320px] object-cover rounded"
                  alt="Beach"
                />
                <div className="absolute inset-0  bg-opacity-50 flex hover:bg-black hover:bg-opacity-50  transition justify-center rounded-lg items-center">
                  <h5 className="text-white font-bold">Beach</h5>
                </div>
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden h-[320px]">
              <a href="#">
                <img
                  src="./image/Hotel in sihanouk/4.jpg"
                  className="w-full h-[320px] object-cover rounded"
                  alt="Camping"
                />
                <div className="absolute inset-0 hover:bg-black hover:bg-opacity-50  transition rounded-lg bg-opacity-50 flex justify-center items-center">
                  <h5 className="text-white font-bold">Camping</h5>
                </div>
              </a>
            </div>
          </div>

          {/* Card 4 */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden h-[320px]">
              <a href="#">
                <img
                  src="./image/Hotel in Kep/1.jpg"
                  className="w-full h-[320px] object-cover rounded"
                  alt="Night Views"
                />
                <div className="absolute inset-0 hover:bg-black hover:bg-opacity-50  transition rounded-lg bg-opacity-50 flex justify-center items-center">
                  <h5 className="text-white font-bold">Night Views</h5>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* View All Packages Button */}
        <div className="mt-4 flex justify-end">
          <button className="px-9 py-2 rounded-full border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition">
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default CardHotel;
