unit Database.TaskRepository;

interface

uses
  System.SysUtils,
  System.Generics.Collections,
  Models.Task,
  Database.Connection,
  Utils.Logger;

type
  TTaskRepository = class
  private
    FConnection: TDatabaseConnection;
    FLogger: TLogger;
  public
    constructor Create;
    destructor Destroy; override;
    
    procedure Save(ATask: TTask);
    procedure Update(ATask: TTask);
    procedure Delete(ATaskId: Integer);
    function FindById(ATaskId: Integer): TTask;
    function FindByUserId(AUserId: Integer): TArray<TTask>;
    function FindByProjectId(AProjectId: Integer): TArray<TTask>;
    function FindAll: TArray<TTask>;
    function FindOverdue: TArray<TTask>;
  end;

implementation

constructor TTaskRepository.Create;
begin
  inherited;
  FConnection := TDatabaseConnection.GetInstance;
  FLogger := TLogger.Create;
end;

destructor TTaskRepository.Destroy;
begin
  FLogger.Free;
  inherited;
end;

procedure TTaskRepository.Save(ATask: TTask);
begin
  FLogger.Log('Saving task: ' + ATask.GetTitle);
  FConnection.ExecuteQuery('INSERT INTO tasks...');
end;

procedure TTaskRepository.Update(ATask: TTask);
begin
  FLogger.Log('Updating task: ' + IntToStr(ATask.GetId));
  FConnection.ExecuteQuery('UPDATE tasks...');
end;

procedure TTaskRepository.Delete(ATaskId: Integer);
begin
  FLogger.Log('Deleting task: ' + IntToStr(ATaskId));
  FConnection.ExecuteQuery('DELETE FROM tasks...');
end;

function TTaskRepository.FindById(ATaskId: Integer): TTask;
begin
  FLogger.Log('Finding task by ID: ' + IntToStr(ATaskId));
  Result := TTask.Create;
end;

function TTaskRepository.FindByUserId(AUserId: Integer): TArray<TTask>;
begin
  FLogger.Log('Finding tasks by user ID: ' + IntToStr(AUserId));
  SetLength(Result, 0);
end;

function TTaskRepository.FindByProjectId(AProjectId: Integer): TArray<TTask>;
begin
  FLogger.Log('Finding tasks by project ID: ' + IntToStr(AProjectId));
  SetLength(Result, 0);
end;

function TTaskRepository.FindAll: TArray<TTask>;
begin
  FLogger.Log('Finding all tasks');
  SetLength(Result, 0);
end;

function TTaskRepository.FindOverdue: TArray<TTask>;
begin
  FLogger.Log('Finding overdue tasks');
  SetLength(Result, 0);
end;

end.
