CD  C:\SkanerWV\Result_WV_Dashboard\ResultDashboard
call ng build --prod &&^
rmdir /S /Q \\10.255.15.148\d$\WcDashboard &&^
echo Folder has been removed &&^
Xcopy /E  C:\SkanerWV\Result_WV_Dashboard\ResultDashboard\dist\ResultDashboard \\10.255.15.148\d$\WcDashboard\
