export const Footer = () => {
    return(
        <footer className="bg-muted p-6 md:py-12 w-full">
          <div className="container max-w-7xl mt-8 flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
      
              <a  href="https://github.com/hashirakb"
                className="hover:text-gray-700 transition-colors duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.481 0-.237-.008-.868-.013-1.703-2.782.602-3.369-1.34-3.369-1.34-.454-1.152-1.11-1.459-1.11-1.459-.908-.618.069-.606.069-.606 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.831.092-.645.35-1.088.636-1.337-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.389-1.979 1.032-2.675-.103-.252-.448-1.266.098-2.638 0 0 .84-.268 2.75 1.026A9.596 9.596 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.372.202 2.386.1 2.638.64.696 1.03 1.587 1.03 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.917.678 1.852 0 1.337-.012 2.415-.012 2.74 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
                  />
                </svg>
                Crafted By HashirAKB
              </a>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>&copy; 2024 HashDev Solutions</span>
            </div>
          </div> 
      </footer>
    )
}