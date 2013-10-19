;;设置中文字体
(set-fontset-font "fontset-default"
'unicode '("Microsoft YaHei" ))

(fset 'yes-or-no-p 'y-or-n-p)

(display-time-mode 1) ;显示时间
(setq display-time-24hr-format t) ;24小时格式
(setq display-time-day-and-date t);显示日期

(column-number-mode t) ;显示列号

;;设置主模式
(setq default-major-mode 'text-mode)

;;ispell强制设置为英文
(setq ispell-dictionary "en_US")

;;简写操作
(setq-default abbrev-mode t)
(read-abbrev-file "~/.emacs.d/.abbrev_defs")
(setq save-abbrevs t)