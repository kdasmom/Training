<!DOCTYPE html>
<html>
<head>
   <style>
   #pageNum { text-align: right; font-size: 11px; border-top: solid 1px; padding-top:2px; }
   </style>
</head>
<body>
   <div id="pageNum">Page <?php echo $_REQUEST['page']; ?> of <?php echo $_REQUEST['topage']; ?></div>
</body>
</html>