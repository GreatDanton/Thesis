#!/usr/bin/python3

print('working?')

final_arr = []
with open('sample_data.csv', 'r+') as file:
    for line in file:
        first = line.find(',')
        second = line.find(',', first + 1)

        new_line = line[:second]
        final_arr.append(new_line)
        print(new_line)

with open('sample_data_fixed.csv', 'w') as file:
    file.write('\n'.join(final_arr))


