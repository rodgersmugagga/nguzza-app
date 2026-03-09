import 'dart:async';
import 'package:flutter/material.dart';

class CountdownTimer extends StatefulWidget {
  final DateTime endTime;
  final TextStyle? digitStyle;
  final TextStyle? labelStyle;

  const CountdownTimer({
    Key? key,
    required this.endTime,
    this.digitStyle,
    this.labelStyle,
  }) : super(key: key);

  @override
  State<CountdownTimer> createState() => _CountdownTimerState();
}

class _CountdownTimerState extends State<CountdownTimer> {
  late Timer _timer;
  late Duration _remaining;

  @override
  void initState() {
    super.initState();
    _remaining = widget.endTime.difference(DateTime.now());
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      final r = widget.endTime.difference(DateTime.now());
      if (r.isNegative) {
        _timer.cancel();
        setState(() => _remaining = Duration.zero);
      } else {
        setState(() => _remaining = r);
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hours = _remaining.inHours;
    final minutes = _remaining.inMinutes.remainder(60);
    final seconds = _remaining.inSeconds.remainder(60);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _segment(hours.toString().padLeft(2, '0')),
        _separator(),
        _segment(minutes.toString().padLeft(2, '0')),
        _separator(),
        _segment(seconds.toString().padLeft(2, '0')),
      ],
    );
  }

  Widget _segment(String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black87,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        value,
        style: widget.digitStyle ??
            const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w700,
              fontFeatures: [FontFeature.tabularFigures()],
            ),
      ),
    );
  }

  Widget _separator() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 2),
      child: Text(
        ':',
        style: TextStyle(
          color: Colors.black87,
          fontSize: 16,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
