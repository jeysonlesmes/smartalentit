import { Logger } from "@shared/application/ports/outbound/logger.port";

interface LogEntry {
  level: 'info' | 'debug' | 'warn' | 'error';
  message: string;
  context?: string;
  trace?: string;
  timestamp: Date;
}

export class InMemoryLogger implements Logger {
  private readonly logs: LogEntry[] = [];

  info(message: string, context?: string): void {
    this.addLog('info', message, context);
  }

  debug(message: string, context?: string): void {
    this.addLog('debug', message, context);
  }

  warn(message: string, context?: string): void {
    this.addLog('warn', message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.addLog('error', message, context, trace);
  }

  private addLog(
    level: 'info' | 'debug' | 'warn' | 'error',
    message: string,
    context?: string,
    trace?: string,
  ): void {
    const logEntry: LogEntry = {
      level,
      message,
      context,
      trace,
      timestamp: new Date(),
    };

    this.logs.push(logEntry);
    
    console.log(`[${level.toUpperCase()}] ${message}`, context ? `Context: ${context}` : '', trace ? `Trace: ${trace}` : '');
  }
  
  getLogs(): LogEntry[] {
    return this.logs;
  }
  
  clearLogs(): void {
    this.logs.length = 0;
  }
}