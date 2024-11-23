from datetime import datetime, time

# 获取当前时间
now = datetime.now()

# 获取当前的时间部分
current_time = now.time()

# 定义早上10点和晚上10点的时间
morning_time = time(10-8, 0)  # 早上10点
evening_time = time(22-8, 0)   # 晚上10点

# 判断当前时间是否在早上10点到晚上10点之间
if not (time(10-8, 0) <= now.time() and now.time() <= time(22-8, 0)):
    print("当前时间在早上10点到晚上10点之间。")
else:
    print("当前时间不在早上10点到晚上10点之间。")