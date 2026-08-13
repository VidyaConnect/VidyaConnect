'use client';

import { useEffect, useState } from 'react';
import { Announcement } from '../types/announcement';
import { getAnnouncements } from '../services/announcementService';


const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  emergency: 'bg-red-100 text-red-700 border-red-200',
  urgent: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  update: 'bg-green-100 text-green-700 border-green-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  normal: 'bg-gray-100 text-gray-700 border-gray-200'
};


export default function AnnouncementList() {


  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);


  const [selectedId, setSelectedId] =
    useState<string | null>(null);


  const [isLoading, setIsLoading] =
    useState(true);


  const [errorMessage, setErrorMessage] =
    useState('');



  useEffect(() => {


    async function loadData() {


      setIsLoading(true);

      setErrorMessage('');



      try {


        const data = await getAnnouncements();


        setAnnouncements(data);



        if (data.length > 0) {

          setSelectedId(data[0].id);

        }



      } catch (error) {


        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to load announcements.'
        );


      } finally {


        setIsLoading(false);


      }


    }



    loadData();


  }, []);




  const selected =
    announcements.find(
      (a) => a.id === selectedId
    );




  if (isLoading) {

    return (

      <p className="text-gray-500 text-sm p-6">

        Loading announcements...

      </p>

    );

  }




  if (errorMessage) {

    return (

      <p className="text-red-600 text-sm p-6">

        {errorMessage}

      </p>

    );

  }




  if (announcements.length === 0) {

    return (

      <p className="text-gray-500 text-sm p-6">

        No announcements available yet.

      </p>

    );

  }





  return (

    <div className="
      min-h-screen
      bg-gray-50
      p-6
    ">


      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
      ">



        {/* LEFT SIDE */}


        <div className="
          lg:col-span-2
          space-y-6
        ">



          {/* HEADER */}


          <div className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            p-6
            shadow-sm
            flex
            items-center
            justify-between
          ">


            <div>


              <h1 className="
                text-3xl
                font-bold
                text-gray-900
              ">

                Announcements

              </h1>



              <p className="
                text-gray-500
                mt-2
                text-sm
              ">

                Manage school updates and communication messages.

              </p>


            </div>




            <a
              href="/announcements/create"
              className="
                bg-blue-900
                hover:bg-blue-800
                text-white
                px-5
                py-3
                rounded-xl
                text-sm
                font-medium
                shadow
                transition
              "
            >

              + New Announcement

            </a>



          </div>





          {/* SUMMARY CARDS */}


          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          ">



            <div className="
              bg-white
              border
              rounded-2xl
              p-5
              shadow-sm
            ">


              <p className="
                text-sm
                text-gray-500
              ">

                Total Announcements

              </p>


              <h2 className="
                text-3xl
                font-bold
                mt-2
                text-gray-900
              ">

                {announcements.length}

              </h2>


            </div>





            <div className="
              bg-white
              border
              rounded-2xl
              p-5
              shadow-sm
            ">


              <p className="
                text-sm
                text-gray-500
              ">

                Latest Announcement

              </p>



              <p className="
                font-semibold
                mt-2
                truncate
              ">

                {announcements[0].title}

              </p>


            </div>





            <div className="
              bg-white
              border
              rounded-2xl
              p-5
              shadow-sm
            ">


              <p className="
                text-sm
                text-gray-500
              ">

                Total Views

              </p>


              <h2 className="
                text-3xl
                font-bold
                mt-2
              ">


                {
                  announcements.reduce(
                    (total, item) =>
                      total +
                      (item.reachAnalytics?.totalViews ?? 0),
                    0
                  )
                }


              </h2>


            </div>



          </div>
                    {/* ANNOUNCEMENT LIST */}


          <div className="
            space-y-4
          ">


            {
              announcements.map((a) => (


                <button

                  key={a.id}

                  onClick={() =>
                    setSelectedId(a.id)
                  }


                  className={`
                    w-full
                    text-left
                    bg-white
                    rounded-2xl
                    border
                    p-5
                    shadow-sm
                    transition
                    hover:shadow-md
                    hover:border-blue-300

                    ${
                      selectedId === a.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }

                  `}

                >



                  <div className="
                    flex
                    flex-col
                    gap-4
                  ">



                    <div className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    ">



                      <div>


                        <h2 className="
                          text-lg
                          font-semibold
                          text-gray-900
                        ">

                          {a.title}

                        </h2>




                        <p className="
                          text-sm
                          text-gray-500
                          mt-2
                          line-clamp-2
                        ">

                          {a.content}

                        </p>



                      </div>





                      <span

                        className={`
                          px-3
                          py-1
                          rounded-full
                          border
                          text-xs
                          font-medium
                          capitalize

                          ${
                            PRIORITY_STYLES[a.priority]
                            ||
                            PRIORITY_STYLES.normal
                          }

                        `}

                      >

                        {a.priority}

                      </span>



                    </div>





                    <div className="
                      flex
                      flex-wrap
                      gap-4
                      text-xs
                      text-gray-400
                    ">



                      <span>

                        Posted by:

                        {' '}

                        {a.postedBy.name}

                      </span>





                      <span>

                        Date:

                        {' '}

                        {
                          new Date(
                            a.publishDate
                          ).toLocaleDateString()
                        }

                      </span>





                      <span>

                        Views:

                        {' '}

                        {
                          a.reachAnalytics?.totalViews ?? 0
                        }

                      </span>



                    </div>



                  </div>



                </button>


              ))
            }



          </div>



        </div>





        {/* RIGHT SIDE DETAIL PANEL */}



        <div className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          p-6
          h-fit
        ">


          {

            selected ? (


              <div className="
                space-y-5
              ">



                <span className="
                  inline-block
                  bg-green-100
                  text-green-700
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold
                ">

                  ACTIVE ANNOUNCEMENT

                </span>





                <h2 className="
                  text-2xl
                  font-bold
                  text-gray-900
                ">

                  {selected.title}

                </h2>





                <div className="
                  text-sm
                  text-gray-500
                  space-y-3
                ">



                  <p>

                    Posted by:

                    {' '}

                    {selected.postedBy.name}

                  </p>





                  <p>

                    Published:

                    {' '}

                    {
                      new Date(
                        selected.publishDate
                      ).toLocaleDateString()
                    }

                  </p>





                  <p>

                    Views:

                    {' '}

                    {
                      selected.reachAnalytics?.totalViews ?? 0
                    }

                  </p>



                </div>





                <hr />





                <div>


                  <h3 className="
                    text-xs
                    font-semibold
                    uppercase
                    text-gray-400
                    mb-3
                  ">

                    Content Preview

                  </h3>





                  <p className="
                    text-gray-700
                    leading-relaxed
                    whitespace-pre-line
                  ">

                    {selected.content}

                  </p>



                </div>





                <div>


                  <span

                    className={`
                      inline-block
                      px-4
                      py-2
                      rounded-full
                      border
                      text-sm
                      font-medium
                      capitalize

                      ${
                        PRIORITY_STYLES[selected.priority]
                        ||
                        PRIORITY_STYLES.normal
                      }

                    `}

                  >

                    Priority:

                    {' '}

                    {selected.priority}

                  </span>



                </div>



              </div>



            ) : (


              <p className="
                text-gray-400
                text-sm
              ">

                Select an announcement to view details.

              </p>


            )


          }



        </div>



      </div>


    </div>


  );


}